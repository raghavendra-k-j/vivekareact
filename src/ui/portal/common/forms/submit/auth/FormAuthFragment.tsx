import { Observer } from "mobx-react-lite";
import AppBarLogo from "~/ui/components/AppBarLogo";
import { UnknowStateView } from "~/ui/components/errors/UnknowStateView";
import { AppBarUserAvatar } from "~/ui/portal/components/avatar/AppBarUserAvatar";
import { SubmitPageAppBar } from "../components/SubmitPageAppBar";
import { CollectDetailsView } from "./CollectDetailsView";
import { useFormAuthStore } from "./FormAuthContext";
import { FormAuthProvider } from "./FormAuthProvider";
import { FormCurrentAuthFragment } from "./FormCurrentAuthFragment";
import { VerifyEmailView } from "./VerifyEmailView";


export function FormAuthFragment() {
    return (
        <FormAuthProvider>
            <Body />
        </FormAuthProvider>
    );
}


function Body() {
    const store = useFormAuthStore();
    return (
        <div className="h-screen flex flex-col">
            <SubmitPageAppBar
                leading={<AppBarLogo />}
                trailing={<AppBarUserAvatar />}
            />
            <main className="overflow-y-auto p-4 sm:p-6">
                <Observer>
                    {() => {
                        switch (store.currentFragment) {
                            case FormCurrentAuthFragment.CollectDetails:
                                return <CollectDetailsView />;
                            case FormCurrentAuthFragment.VerifyEmail:
                                return <VerifyEmailView />;
                            default:
                                return <UnknowStateView />;
                        }
                    }}
                </Observer>
            </main>
        </div>
    );
}





