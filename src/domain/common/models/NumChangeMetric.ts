
type NumChangeMetricProps = {
    value: number;
    percentage: number;
    status: NumMetricChangeStatus;
}

export class NumChangeMetric {
    value: number;
    percentage: number;
    status: NumMetricChangeStatus;

    get isIncrease(): boolean {
        return this.status === NumMetricChangeStatus.Increase;
    }

    get isDecrease(): boolean {
        return this.status === NumMetricChangeStatus.Decrease;
    }

    get isNoChange(): boolean {
        return this.status === NumMetricChangeStatus.NoChange;
    }

    constructor(props: NumChangeMetricProps) {
        this.value = props.value;
        this.percentage = props.percentage;
        this.status = props.status;
    }

    static calculateChange(first: number, second: number): NumChangeMetric {
        const value = second - first;

        const percentage = first !== 0
            ? (value / first) * 100
            : (second !== 0 ? 100 : 0);

        const status = getChangeStatus(value);

        return new NumChangeMetric({
            value,
            percentage,
            status
        });
    }

}


export enum NumMetricChangeStatus {
    Increase = 'increase',
    Decrease = 'decrease',
    NoChange = 'no-change',
}

export function getChangeStatus(diff: number): NumMetricChangeStatus {
    if (diff > 0) return NumMetricChangeStatus.Increase;
    if (diff < 0) return NumMetricChangeStatus.Decrease;
    if (diff === 0) return NumMetricChangeStatus.NoChange;
    throw new Error(`Invalid diff value: ${diff}. Expected a number.`);
}

