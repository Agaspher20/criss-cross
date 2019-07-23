import React from "react";

export interface NameInputProps {
    readonly placeHolder: string;
    readonly message: string;
    readonly disabled?: boolean;
    onSubmit?: (name: string) => void;
}

interface NameInputState {
    readonly name: string;
}

export class NameInputComponent extends React.Component<NameInputProps, NameInputState> {
    public constructor(props: NameInputProps) {
        super(props);
        this.state = { name: "" };
    }

    public render(): React.ReactElement {
        return (<form action="."
                      onSubmit={ e => this.handleFormSubmit(e) }>
            <input type="text"
                   disabled={ this.props.disabled }
                   placeholder={ this.props.placeHolder }
                   value={ this.state.name }
                   onChange={ e => this.handleInputChange(e) } />
            <input type="submit" value={ this.props.message } />
        </form>);
    }

    private handleFormSubmit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();

        if (!this.state.name || !this.state.name.trim()) {
            return;
        }

        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.name);
        }

        this.setState({ name: "" });
    }

    private handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ name: e.target.value });
    }
}
