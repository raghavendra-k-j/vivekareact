import { Observer } from "mobx-react-lite";
import Select from "react-select";
import { Country } from "~/domain/common/models/Country";
import { Subdivision } from "~/domain/common/models/Subdivision";
import { PortalSelect } from "~/ui/components/PortalSelect";
import { FLabel } from "~/ui/widgets/form/FLabel";
import { FReqMark } from "~/ui/widgets/form/FReqMark";
import { FTextField } from "~/ui/widgets/form/input/FTextField";
import { useCheckoutPageStore } from "../CheckoutPageContext";
import { CheckoutCard, CheckoutCardHeader } from "./CheckoutCard";



export function BillingAddressSection() {
    return (
        <div className="flex flex-col gap-2 flex-1">
            <AddressInformation />
        </div>
    );
}

function AddressInformation() {
    const store = useCheckoutPageStore();
    return (
        <CheckoutCard className="p-4 md:p-6">

            <CheckoutCardHeader
                title="Billing Address"
                description="This information will be used for invoicing and taxes."
            />

            <div className="space-y-4 mt-4">

                <Observer>{() => (
                    <FTextField
                        onChange={() => store.bafVm.fullNameField.validate()}
                        required={!store.bafVm.isBusiness}
                        label="Name"
                        field={store.bafVm.fullNameField}
                        placeholder="Enter your full name"
                    />)}
                </Observer>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FTextField
                        required={true}
                        label="Email Address"
                        field={store.bafVm.emailField}
                        placeholder="Enter Email Address"
                    />
                    <FTextField
                        required={true}
                        label="Mobile Number"
                        field={store.bafVm.mobileField}
                        placeholder="Enter Mobile Number"
                    />
                </div>

                <div>
                    <FLabel>Country <FReqMark /></FLabel>
                    <Select<Country>
                        className="mt-1"
                        options={[store.pcd.country]}
                        value={store.pcd.country}
                        getOptionLabel={(option) => option.name}
                        placeholder="Select country"
                        isDisabled
                    />
                </div>

                <FTextField
                    required={true}
                    label="Address Line 1"
                    field={store.bafVm.line1Field}
                    placeholder="Enter Address Line 1"
                />
                <FTextField
                    label="Address Line 2"
                    field={store.bafVm.line2Field}
                    placeholder="Enter Address Line 2"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {store.pcd.country.metadata?.hasCity && (
                        <FTextField
                            label={store.pcd.country.metadata?.cityLabel}
                            required={true}
                            field={store.bafVm.cityField}
                            placeholder={`Enter ${store.pcd.country.metadata?.cityLabel}`}
                        />
                    )}
                    {store.pcd.country.metadata?.hasPostalCode && (
                        <FTextField
                            label={store.pcd.country.metadata?.postalCodeLabel}
                            required={true}
                            field={store.bafVm.postalCodeField}
                            placeholder={`Enter ${store.pcd.country.metadata?.postalCodeLabel}`}
                        />
                    )}
                </div>
                {store.pcd.country.metadata?.hasSubdivision && (<SubdivisionField />)}
            </div>
        </CheckoutCard>
    );
}


function SubdivisionField() {
    const store = useCheckoutPageStore();
    if (store.pcd.country.metadata?.subdivisionInputType == "select") {
        return (
            <div>
                <FLabel>{store.pcd.country.metadata?.subdivisionLabel} <FReqMark /></FLabel>
                <Observer>
                    {() => (<PortalSelect<Subdivision>
                        className="mt-1"
                        options={store.pcd.subdivisions!}
                        value={store.bafVm.subdivision}
                        onChange={(v) => store.bafVm.onSubdivisionChange(v)}
                        placeholder={store.pcd.country.metadata?.subdivisionLabel}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.code}
                        isSearchable
                    />)}
                </Observer>
            </div>
        );
    }
    return (
        <FTextField
            required={true}
            label={store.pcd.country.metadata?.subdivisionLabel}
            field={store.bafVm.subdivisionField}
            placeholder={store.pcd.country.metadata?.subdivisionLabel}
        />
    );
}