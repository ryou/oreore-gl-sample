import * as React from 'react';

interface RangeProps {
    value: number;
    onChange: (value: number) => void | undefined;
    min: number;
    max: number;
    step: number;
}

interface RangeStates {}

export class Range extends React.Component<RangeProps, RangeStates> {
    constructor(props: RangeProps) {
        super(props);
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const number = Number(e.target.value);
        this.props.onChange(number);

        e.preventDefault();
    }

    render() {
        return React.createElement(
            'input',
            {
                type: 'range',
                value: this.props.value,
                onChange: (e) => { this.handleChange(e) },
                step: this.props.step,
                min: this.props.min,
                max: this.props.max,
            }
        );
    }
}
