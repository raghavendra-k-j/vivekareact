declare class Razorpay {
  constructor(options: JsonObj);
  open(): void;
  on(event: string, callback: (data: JsonObj) => void): void;
}
