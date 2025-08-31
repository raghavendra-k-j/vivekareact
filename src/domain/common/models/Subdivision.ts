export type SubdivisionProps = {
    id: number;
    countryId: number;
    name: string;
    code: string;
    metadata?: Record<string, any>;
}

export class Subdivision {

    readonly id: number;
    readonly countryId: number;
    readonly name: string;
    readonly code: string;
    readonly metadata?: Record<string, any>;

    constructor(props: SubdivisionProps) {
        this.id = props.id;
        this.countryId = props.countryId;
        this.name = props.name;
        this.code = props.code;
        this.metadata = props.metadata;
    }

    static fromJson(json: any): Subdivision {
        return new Subdivision({
            id: json.id,
            countryId: json.countryId,
            name: json.name,
            code: json.code,
            metadata: json.metadata,
        });
    }

}