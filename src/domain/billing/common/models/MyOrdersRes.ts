import { PageInfo } from "~/domain/common/models/PageInfo";
import { OrderLI } from "./OrderLI";
import { JsonObj } from "~/core/types/Json";


export type MyOrdersResProps = {
    pageInfo: PageInfo;
    items: OrderLI[];
}

export class MyOrdersRes {

    pageInfo: PageInfo;
    items: OrderLI[];

    constructor(props: MyOrdersResProps) {
        this.pageInfo = props.pageInfo;
        this.items = props.items;
    }

    static fromJson(json: JsonObj): MyOrdersRes {
        return new MyOrdersRes({
            pageInfo: PageInfo.fromJson(json.pageInfo),
            items: json.items.map((item: JsonObj) => OrderLI.fromJson(item))
        });
    }
}


export type MyOrdersReqProps = {
    page: number;
    pageSize: number;
}

export class MyOrdersReq {

    page: number;
    pageSize: number;

    constructor(props: MyOrdersReqProps) {
        this.page = props.page;
        this.pageSize = props.pageSize;
    }

    toJson(): JsonObj {
        return {
            page: this.page,
            pageSize: this.pageSize
        };
    }

}

