export type ProductTypeProps = {
    label: string;
    value: string;
}

export class ProductType {
    readonly label: string;
    readonly value: string;

    public static readonly PLAN = new ProductType("Plan", "plan");
    public static readonly ADDON = new ProductType("Addon", "addon");

    private static readonly VALUE_MAP: Map<string, ProductType> = new Map([
        [ProductType.PLAN.value, ProductType.PLAN],
        [ProductType.ADDON.value, ProductType.ADDON],
    ]);

    private constructor(label: string, value: string) {
        this.label = label;
        this.value = value;
    }

    static fromValue(value: string): ProductType {
        const productType = ProductType.VALUE_MAP.get(value);
        if (!productType) {
            throw new Error(`Unknown ProductType value: ${value}`);
        }
        return productType;
    }

}
