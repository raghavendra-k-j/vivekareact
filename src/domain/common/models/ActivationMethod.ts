export class ActivationMethod {
  public readonly value: string;
  public readonly label: string;

  private constructor(value: string, label: string) {
    this.value = value;
    this.label = label;
  }

  static readonly SYSTEM = new ActivationMethod("system", "System");
  static readonly USER = new ActivationMethod("user", "User");

  static fromValue(value: string): ActivationMethod {
    switch (value.toLowerCase()) {
      case ActivationMethod.SYSTEM.value:
        return ActivationMethod.SYSTEM;
      case ActivationMethod.USER.value:
        return ActivationMethod.USER;
      default:
        throw new Error(`Unknown ActivationMethod: ${value}`);
    }
  }

  static values(): ActivationMethod[] {
    return [ActivationMethod.SYSTEM, ActivationMethod.USER];
  }
}
