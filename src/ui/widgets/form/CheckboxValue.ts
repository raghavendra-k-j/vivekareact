import { observable } from "mobx";

export function CheckboxValue(initial: boolean) {
    return observable.box<boolean>(initial);
}
