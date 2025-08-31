export class PartyType {

    public readonly label: string;
    public readonly value: string;

    public static readonly INDIVIDUAL = new PartyType("Individual", "individual");
    public static readonly COMPANY = new PartyType("Company", "company");

    constructor(label: string, value: string) {
        this.label = label;
        this.value = value;
    }

    static fromValue(raw: string): PartyType {
        raw = raw.toLowerCase();
        switch (raw) {
            case PartyType.INDIVIDUAL.value:
                return PartyType.INDIVIDUAL;
            case PartyType.COMPANY.value:
                return PartyType.COMPANY;
            default:
                throw new Error("Unknown PartyType value: " + raw);
        }
    }

    isCompany() {
        return this === PartyType.COMPANY;
    }

    isIndividual() {
        return this === PartyType.INDIVIDUAL;
    }
}
