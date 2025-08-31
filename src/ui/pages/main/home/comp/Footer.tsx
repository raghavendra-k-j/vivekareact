import { Heart, Mail } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    const handleEmailClick = (subject: string) => {
        const email = "contact@viveka.ai";
        const encodedSubject = encodeURIComponent(subject);
        window.open(`mailto:${email}?subject=${encodedSubject}`, '_blank');
    };

    return (
        <footer className="bg-gray-900 text-white">
            {/* CTA Section */}
            <div className="bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                            Ready to Transform Your Assessments?
                        </h3>
                        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                            Join thousands of professionals who trust VIVEKA.AI for creating engaging assessments.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors">
                                Start Free Trial
                            </button>
                            <button 
                                onClick={() => handleEmailClick("Demo Request")}
                                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                            >
                                Request Demo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                    {/* Brand Column */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">V</span>
                            </div>
                            <span className="text-xl font-bold">VIVEKA.AI</span>
                        </div>
                        <p className="text-gray-300 mb-4 text-sm">
                            AI-powered assessment creation and analytics platform for modern education and training.
                        </p>
                        <div className="flex items-center gap-2 text-gray-300">
                            <Mail className="w-4 h-4" />
                            <button 
                                onClick={() => handleEmailClick("General Inquiry")}
                                className="hover:text-blue-400 transition-colors text-sm"
                            >
                                contact@viveka.ai
                            </button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button 
                                    onClick={() => handleEmailClick("About Us Inquiry")}
                                    className="text-gray-300 hover:text-blue-400 transition-colors"
                                >
                                    About Us
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => handleEmailClick("Terms of Service Inquiry")}
                                    className="text-gray-300 hover:text-blue-400 transition-colors"
                                >
                                    Terms of Service
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => handleEmailClick("Privacy Policy Inquiry")}
                                    className="text-gray-300 hover:text-blue-400 transition-colors"
                                >
                                    Privacy Policy
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button 
                                    onClick={() => handleEmailClick("Help Center - Documentation Request")}
                                    className="text-gray-300 hover:text-blue-400 transition-colors"
                                >
                                    Documentation
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => handleEmailClick("Technical Support Request")}
                                    className="text-gray-300 hover:text-blue-400 transition-colors"
                                >
                                    Technical Support
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => handleEmailClick("Contact Us")}
                                    className="text-gray-300 hover:text-blue-400 transition-colors"
                                >
                                    Contact Us
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 mt-8 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                            <span>© {currentYear} VIVEKA.AI. All rights reserved.</span>
                            <span>•</span>
                            <span>Designed by</span>
                            <button 
                                onClick={() => handleEmailClick("Sentiacare Partnership Inquiry")}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Sentiacare
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <span>Made with</span>
                            <Heart className="w-4 h-4 text-red-400 fill-current" />
                            <span>for better assessments</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
