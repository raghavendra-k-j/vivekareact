import { ArrowRight, CheckCircle } from "lucide-react";

export function HeroSection() {
    return (
        <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-center lg:text-left">
                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Create Assessments & Surveys
                            <span className="block text-blue-600">with AI Power</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg text-gray-600 mb-8 max-w-xl">
                            Transform documents into customized assessments, analyze performance with AI, 
                            and summarize content effortlessly.
                        </p>

                        {/* Features List */}
                        <div className="flex flex-wrap gap-6 mb-8 text-gray-700">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span>AI-Generated Questions</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span>Real-time Analytics</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span>Multi-language Support</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-flex items-center gap-2">
                            Start Free Trial
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Right Content - Simple Illustration */}
                    <div className="relative">
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                            {/* Mock Dashboard */}
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                                        <span className="text-gray-900 font-semibold">Assessment Dashboard</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-700 font-medium">Assessment Generation</span>
                                            <span className="text-blue-600 text-sm">75%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full">
                                            <div className="w-3/4 h-full bg-blue-600 rounded-full"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <span className="text-gray-700 font-medium">Performance Analytics</span>
                                        <div className="flex gap-2 mt-3">
                                            <div className="flex-1 h-6 bg-blue-200 rounded"></div>
                                            <div className="flex-1 h-8 bg-blue-400 rounded"></div>
                                            <div className="flex-1 h-5 bg-blue-300 rounded"></div>
                                            <div className="flex-1 h-7 bg-blue-500 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
