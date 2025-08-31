export class AmountFmt {
  static format({
    amountMinor,
    minorUnit
  }: {
    amountMinor: number;
    minorUnit: number;
  }): string {
    const factor = 10 ** minorUnit;
    const major  = amountMinor / factor;

    return major.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: minorUnit
    });
  }
}
