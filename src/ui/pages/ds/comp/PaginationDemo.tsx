import { Section } from "./Section";
import { Pagination } from "~/ui/widgets/pagination/Pagination";
import { useState } from "react";

export function PaginationDemo() {
    return <Section title="Pagination" content={<Content />} />;
}

function Content() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5;

    return (
        <div className="flex flex-col gap-4">
            <div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onFirst={() => setCurrentPage(1)}
                    onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    onLast={() => setCurrentPage(totalPages)}
                />
            </div>
        </div>
    );
}
