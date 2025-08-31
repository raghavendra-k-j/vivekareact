import { PaginationDemo } from "./comp/PaginationDemo";
import { SearchBarDemo } from "./comp/SearchBarDemo";
import { IconButtonDemo } from "./comp/IconButtonDemo";
import { ButtonDemo } from "./comp/ButtonDemo";
import { BadgeDemo } from "./comp/BadgeDemo";

export default function DSPage() {
    return (
        <div className="h-full overflow-y-auto flex flex-col gap-4 p-4">
            <SearchBarDemo />
            <PaginationDemo />
            <IconButtonDemo/>
            <ButtonDemo/>
            <BadgeDemo/>
        </div>
    );
}