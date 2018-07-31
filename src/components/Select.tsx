import * as React from 'react';

interface SelectProps {
    value: string;
    items: string[];
    onChange: (value: string) => void | undefined;
}

interface SelectStates {}

export class Select extends React.Component<SelectProps, SelectStates> {
    constructor(props: SelectProps) {
        super(props);
    }

    handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        this.props.onChange(value);

        e.preventDefault();
    }

    render() {
        const options = this.props.items.map(item => {
            return (
                <option
                    value={item.toString()}
                    key={item.toString()}
                >
                    {item}
                </option>
            );
        });
        return (
            <select
                value={this.props.value}
                onChange={(e) => { this.handleChange(e) }}
            >
                {options}
            </select>
        );
    }
}
