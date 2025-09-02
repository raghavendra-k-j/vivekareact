import { useRef } from "react";
import { MainBaseAppBar } from "~/ui/components/logo/MainBaseAppBar";
import { SignUpPageContext } from "./SignUpPageContext";
import { SignUpPageStore } from "./SignUpPageStore";
import { MainHomeAppBar } from "~/ui/components/logo/MainHomeAppBar";

export function SignUpPageProvider() {
    const store = useRef<SignUpPageStore>(new SignUpPageStore());
    return (<SignUpPageContext.Provider value={store.current}>
        <SignUpPage />
    </SignUpPageContext.Provider>);
}

export default function SignUpPage() {
    return (
        <div>
            <MainHomeAppBar />
            <div>Main Content Goes Here</div>
        </div>
    );
}