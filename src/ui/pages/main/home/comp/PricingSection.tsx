import { ArrowRight, BadgeCheck, MessageCircle } from "lucide-react";
import { Button } from "~/ui/components/buttons/button";
import { SectionHeader } from "./CoreSection";

export function PricingSection() {
    function openChat() {
        window.Tawk_API?.toggle?.();
    }

    return (
        <section id="pricing" className="relative overflow-hidden">
            {/* Emerald / green background gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-50 via-white to-emerald-50" />

            <div className="relative container px-4 py-20 text-center">
                <SectionHeader
                    title="Pricing"
                    titleClassName="text-primary-600"
                    description="Affordable, fair pricing — we value your money."
                />

                <div className="mt-12 flex justify-center">
                    <div className="max-w-lg w-full bg-white shadow-lg rounded-2xl p-10 border border-primary-100">
                        {/* Subtle value badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                            <BadgeCheck size={16} />
                            Best value for your money
                        </div>

                        <h3 className="mt-4 text-2xl font-bold text-gray-900">
                            Simple price to scale
                        </h3>

                        <p className="mt-2 text-gray-600">
                            No confusing tiers, just transparent, fair pricing.
                            Reach out and we’ll tailor the plan to your needs.
                        </p>

                        <Button
                            onClick={openChat}
                            size="lg"
                            className="mt-8 w-full flex items-center justify-center gap-2
                                bg-gradient-to-r from-primary-500 to-primary-700
                                text-white shadow-md hover:shadow-lg active:scale-[0.99] transition-all"
                            aria-label="Contact us for pricing"
                        >
                            Contact Us
                            <MessageCircle size={18} />
                            <ArrowRight size={18} />
                        </Button>

                        {/* Tiny reassurance line */}
                        <p className="mt-4 text-xs text-gray-500">
                            Fast response. No obligations.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}