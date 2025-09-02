import { Input } from "~/ui/widgets/form/Input";
import { useResponseViewStore } from "../../ResponseViewContext";

export function SearchBar() {
    const store = useResponseViewStore();
    return (<Input
        placeholder="Search Questions"
        type="search"
        onChange={(e) => store.onSearchQueryChanged(e.target.value)}
    />);
}