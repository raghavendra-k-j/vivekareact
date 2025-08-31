import { Menu, X } from "lucide-react";
import { useState } from "react";

export function AppBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm border-b border-default">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">V</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">VIVEKA</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <button
                            onClick={() => scrollToSection('features')}
                            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                        >
                            Features
                        </button>
                        <button
                            onClick={() => scrollToSection('use-cases')}
                            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                        >
                            Use Cases
                        </button>

                        {/* CTA Buttons */}
                        <div className="flex items-center gap-3">
                            <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                                Login
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                Start Free Trial
                            </button>
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => scrollToSection('features')}
                                className="text-gray-600 hover:text-blue-600 font-medium text-left transition-colors"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => scrollToSection('use-cases')}
                                className="text-gray-600 hover:text-blue-600 font-medium text-left transition-colors"
                            >
                                Use Cases
                            </button>
                            <div className="flex flex-col gap-3 pt-2">
                                <button className="text-gray-600 hover:text-gray-900 font-medium text-left transition-colors">
                                    Login
                                </button>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-left">
                                    Start Free Trial
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
