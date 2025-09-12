import { ArrowRight, MessageCircle } from "lucide-react";
import { SectionHeader, SectionWrapper } from "./CoreSection";
import { Button } from "~/ui/widgets/button/Button";
import { getTawkApi } from "~/infra/tawkto/types";
import { showSuccessToast } from "~/ui/widgets/toast/toast";

export function PricingSection() {
    return (
        <SectionWrapper gradientClasses="from-emerald-50 via-white to-emerald-50">
            <SectionHeader
                title="Pricing"
                titleClassName="text-emerald-600"
                description="Fair and transparent—built to fit your needs."
            />
            <PricingCard />
        </SectionWrapper>
    );
}

function PricingCard() {
    function toggleChat() {
        if (!getTawkApi()) return;
        if(getTawkApi()?.isChatMaximized?.() === true) {
            showSuccessToast({
                message: "Chat is already open",
                description: "Feel free to ask us any questions you have!",
                position: "top-center",
            });
        }
        getTawkApi()?.maximize?.();
    }
    return (
        <div className="mt-12 flex justify-center">
            <div className="max-w-lg w-full bg-white shadow-lg rounded-2xl p-10 border border-default">
                <h3 className="mt-4 text-2xl text-center font-bold text-default">
                    Simple pricing that scales
                </h3>

                <p className="mt-2 text-secondary text-center">
                    Skip the confusing tiers. Tell us what you need and we’ll shape a plan around it.
                </p>

                <Button
                    onClick={toggleChat}
                    size="lg"
                    shadow="lg"
                    className="w-full mt-6"
                    aria-label="Open chat to discuss pricing"
                >
                    <MessageCircle size={18} />
                    Chat about pricing
                    <ArrowRight size={18} />
                </Button>

                <p className="mt-3 text-tertiary text-center text-xs">
                    Fast response. No pressure.
                </p>
            </div>
        </div>
    );
}
