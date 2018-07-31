import * as React from 'react';

interface InputProps {
    onChange: (text: string) => void | undefined,
}

interface InputStates {
    value: string;
}

export class Input extends React.Component<InputProps, InputStates> {
    constructor(props: InputProps) {
        super(props);

        this.state = {
            value: '',
        };
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const text = e.target.value;
        this.setState({ value: text });
        this.props.onChange(text);
    }

    render() {
        return React.createElement(
            'input',
            {
                type: 'text',
                onChange: (e) => { this.handleChange(e) },
            }
        );
    }
}
