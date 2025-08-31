import { SearchInput } from "~/ui/widgets/search/SearchInput";
import { Section } from "./Section";

export function SearchBarDemo() {
    return (
        <Section
            title="Search Bar"
            content={<Content />}
        />
    );
}

function Content() {
    return (
        <div className="flex flex-col gap-4">
            <SearchInput inputSize="xs" placeholder="Search (extra small)" />
            <SearchInput inputSize="sm" placeholder="Search (small)" />
            <SearchInput inputSize="md" placeholder="Search (medium)" />
            <SearchInput inputSize="lg" placeholder="Search (large)" />
            <SearchInput inputSize="xl" placeholder="Search (extra large)" />
        </div>
    );
}
