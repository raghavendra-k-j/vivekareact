export class AssmntDomain {
    static readonly MathOrScience = new AssmntDomain({ type: "MATH_SCIENCE", name: "Math/Science" });

    readonly type: string;
    readonly name: string;

    private constructor({ type, name }: { type: string; name: string }) {
        this.type = type;
        this.name = name;
    }

    get isMathOrScience(): boolean {
        return this.type === AssmntDomain.MathOrScience.type;
    }


    static get values(): AssmntDomain[] {
        return [AssmntDomain.MathOrScience];
    }

    static fromType(type: string | null | undefined): AssmntDomain | null {
        if (!type) return null;
        return AssmntDomain.values.find(
            (assmntType) => assmntType.type.toLowerCase() === type.toLowerCase()
        ) || null;
    }
}