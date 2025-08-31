import { JsonObj } from "~/core/types/Json";
import { PGOrderData } from "./PGOrderData";

export type RzpOrderDataProps = PGOrderData & {
    rzpOrderId: string;
    rzpKey: string;
}

export class RzpOrderData extends PGOrderData {

    rzpOrderId: string;
    rzpKey: string;

    constructor(props: RzpOrderDataProps) {
        super(props);
        this.rzpOrderId = props.rzpOrderId;
        this.rzpKey = props.rzpKey;
    }

    static fromJson(json: JsonObj): RzpOrderData {
        return new RzpOrderData({
            rzpOrderId: json.rzpOrderId,
            rzpKey: json.rzpKey,
        });
    }


}