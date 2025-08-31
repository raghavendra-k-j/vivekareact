export class SharedEmailConst {
    static readonly minLen = 6;
    static readonly maxLen = 60;
    static readonly pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,}){1,3}$/;
}