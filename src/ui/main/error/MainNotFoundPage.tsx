import { NotFoundView } from "~/ui/components/error/NotFoundView";
import { MainLayoutContainer } from "../home/comp/MainLayoutContainer";

export default function MainNotFoundPage() {
    return (<MainLayoutContainer>
        <div className="flex flex-col items-center justify-center p-6 shrink-0 min-h-[576px]">
            <NotFoundView />
        </div>
    </MainLayoutContainer >);
}
