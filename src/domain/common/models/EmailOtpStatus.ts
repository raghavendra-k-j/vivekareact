import { JsonObj } from "~/core/types/Json";


export type EmailOtpStatusProps = {
    status: boolean;
    code: string | null;
    message: string | null;
}

export class EmailOtpStatus {

    public readonly success: boolean;
    public readonly code: string | null;
    public readonly message: string | null;

    constructor(props: EmailOtpStatusProps) {
        this.success = props.status;
        this.code = props.code;
        this.message = props.message;
    }

    static fromJson(json: JsonObj): EmailOtpStatus {
        return new EmailOtpStatus({
            status: json.status,
            code: json.code,
            message: json.message,
        });
    }

}