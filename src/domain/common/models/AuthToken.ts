import { JsonObj } from "~/core/types/Json";

export class AuthToken {

    public readonly accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    static fromJson(json: JsonObj): AuthToken {
        return new AuthToken(json.accessToken);
    }

    static fromAccessToken(accessToken: string): AuthToken {
        return new AuthToken(accessToken);
    }

}
