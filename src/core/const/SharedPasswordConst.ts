export class PasswordConstants {
    static readonly minLen = 8;
    static readonly maxLen = 20;
    static readonly hashedMaxLen = 60;

    static readonly patternUpperCase = /[A-Z]/;
    static readonly patternLowerCase = /[a-z]/;
    static readonly patternDigit = /[0-9]/;
    static readonly patternSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
}
