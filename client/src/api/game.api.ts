export type ConnectionCallback<T> = (data: T) => void;

export type ChannelCallback = ConnectionCallback<string>;

export enum ConnectionStates {
    Connected = "Connected",
    Disconnected = "Disconnected",
    Error = "Error"
}

const webSocketAddress = `ws://${window.location.host}/ws/game`;
const listeners = new Map<string, Set<ChannelCallback>>();
const connectionStateListeners = new Set<ConnectionCallback<ConnectionStates>>();

let connected = true;
let webSocketPromise: Promise<WebSocket>;

window.onbeforeunload = () => {
    connected = false;
    webSocketPromise.then(ws => ws.close());
}

function createWebSocket(): Promise<WebSocket> {
    return new Promise(resolve => {
        const webSocket = new WebSocket(webSocketAddress);
        webSocket.onerror = event => {
            console.log("On connection error", event);
            notifyListeners(ConnectionStates.Error, connectionStateListeners);
        }
        webSocket.onopen = () => {
            notifyListeners(ConnectionStates.Connected, connectionStateListeners);
            resolve(webSocket);
        };
        webSocket.onmessage = onMessage;
        webSocket.onclose = () => {
            notifyListeners(ConnectionStates.Disconnected, connectionStateListeners);
            if (connected) {
                webSocketPromise = createWebSocket();
            }
        }
    });
}

function notifyListeners<T>(data: T, listeners: Set<ConnectionCallback<T>>): void {
    listeners.forEach(callback => callback(data));
}

function onMessage(event: MessageEvent): void {
    const stringData: string = event.data;
    const delimiterIndex = stringData.indexOf("|");

    if (delimiterIndex > 0) {
        const channel = stringData.substring(0, delimiterIndex);
        
        const channelListeners = listeners.get(channel);
        if (channelListeners) {
            const payload = stringData.substring(delimiterIndex + 1);
            notifyListeners(payload, channelListeners);
        } else {
            console.error(`Web socket listeners for channel with name "${channel}" not found`);
        }
    } else {
        console.error(`Web socket message parse failed "${event.data}"`);
    }
}

function listenFirstInternal(
    channel: string,
    stopCallbacks: (() => void)[]
): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const stateListener = (state: ConnectionStates) => {
            switch(state) {
                case ConnectionStates.Disconnected:
                case ConnectionStates.Error:
                    reject(state);
            }
        };

        const listener = (response: string) => {
            resolve(response);
        };

        stopCallbacks.push(() => stopListenChannel(channel, listener));
        stopCallbacks.push(() => stopListenState(stateListener));
        listenChannel(channel, listener);
        listenConnectionState(stateListener);
    });
}

export function listenChannel(channel: string, callback: ChannelCallback): void {
    if (!channel || !callback) {
        return;
    }

    let channelListeners = listeners.get(channel);

    if (!channelListeners) {
        channelListeners = new Set<ChannelCallback>();
        listeners.set(channel, channelListeners);
    }
    
    channelListeners.add(callback);
}

export function listenFirst(channel: string): Promise<string> {
    const stopCallbacks: (() => void)[] = [];
    return listenFirstInternal(channel, stopCallbacks).finally(() => stopCallbacks.forEach(cb => cb()));
}

export function listenConnectionState(callback: ConnectionCallback<ConnectionStates>): void {
    if (!callback) {
        return;
    }

    connectionStateListeners.add(callback);
}

export function stopListenState(callback: ConnectionCallback<ConnectionStates>): void {
    connectionStateListeners.delete(callback);
}

export function stopListenChannel(channel: string, callback: ChannelCallback) {
    let channelListeners = listeners.get(channel);

    if (!channelListeners) {
        return;
    }

    channelListeners.delete(callback)
}

export async function sendData(channel: string, data: string): Promise<void> {
    console.log("Sending data to channel: ", channel);
    if (!webSocketPromise) {
        return Promise.reject("Application not connected");
    }

    try {
        const webSocket = await webSocketPromise;
        webSocket.send(`${channel}|${data}`);
    } catch(error) {
        return Promise.reject();
    }

    return Promise.resolve();
}

export async function requestResponse(channel: string, data: string): Promise<string> {
    let result: Promise<string>;
    const stopCallbacks: (() => void)[] = [];
    try {
        const responsePromise = listenFirstInternal(channel, stopCallbacks);

        await sendData(channel, data);

        result = responsePromise;
    } catch (error) {
        result = Promise.reject(error);
    }

    return result.finally(() => stopCallbacks.forEach(cb => cb()));
}

export function connectToServer(): void {
    webSocketPromise = createWebSocket();
}
