import { CommonCenterCard } from "./CommonCard";

export function InitCard() {
    return (
        <CommonCenterCard>
            <div className="flex flex-col items-center justify-center gap-4 w-full py-[3rem]">
                <img
                    src="https://cdni.iconscout.com/illustration/premium/thumb/student-giving-exam-illustration-download-in-svg-png-gif-file-formats--online-test-question-paper-education-pack-school-illustrations-3363987.png?f=webp"
                    alt="Student giving exam illustration"
                    className="w-40 h-40 object-contain mb-2"
                    loading="lazy"
                />
                <div className="text-center mb-8">
                    <p className="text-xl font-bold text-gray-800 mb-2">Create Question Papers Instantly with AI</p>
                    <p className="text-gray-600 text-base max-w-xl mx-auto">
                        Paste your textbook content or upload a file, then describe the exam pattern — our AI will generate a structured, high-quality question paper in seconds.
                    </p>
                </div>
            </div>
        </CommonCenterCard>
    );
}