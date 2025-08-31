import { UUIDUtil } from "~/core/utils/UUIDUtil";

export type TestQuestionProps = {
    question: string;
};

export class TestQuestion {
    id: string = UUIDUtil.compact;
    question: string;

    constructor(props: TestQuestionProps) {
        this.question = props.question;
    }

    static createTestQuestions(): TestQuestion[] {
        return [
            new TestQuestion({ question: "ಫ್ರಾನ್ಸ್‌ನ ರಾಜಧಾನಿ ಯಾವುದು?" }),
            new TestQuestion({ question: "5 + 7 ಎಷ್ಟು?" }),
            new TestQuestion({ question: "'ಹ್ಯಾಮ್ಲೆಟ್' ಎಂಬ ನಾಟಕವನ್ನು ಯಾರು ಬರೆದರು?" }),
            new TestQuestion({ question: "ನೀರು ಸೆಲ್ಸಿಯಸ್‌ನಲ್ಲಿ ಎಷ್ಟು ಉಷ್ಣತೆಯಲ್ಲಿ ಕುದಿಯುತ್ತದೆ?" }),
            new TestQuestion({ question: "ನಮ್ಮ ಸೌರಮಂಡಲದ ಅತಿದೊಡ್ಡ ಗ್ರಹ ಯಾವುದು?" }),
            new TestQuestion({ question: "ದ್ವಿತೀಯ ವಿಶ್ವಯುದ್ಧ ಯಾವ ವರ್ಷದಲ್ಲಿ ಮುಕ್ತಾಯವಾಯಿತು?" }),
            new TestQuestion({ question: "ಬ್ರೆಜಿಲ್‌ನಲ್ಲಿ ಮುಖ್ಯವಾಗಿ ಯಾವ ಭಾಷೆ ಮಾತನಾಡಲಾಗುತ್ತದೆ?" }),
            new TestQuestion({ question: "81 ರ ವರ್ಗಮೂಲ ಎಷ್ಟು?" }),
            new TestQuestion({ question: "ಚಿನ್ನದ ರಾಸಾಯನಿಕ ಚಿಹ್ನೆ ಏನು?" }),
            new TestQuestion({ question: "ಮೊನಾಲಿಸಾ ಚಿತ್ರವನ್ನು ಯಾರು ಬಿಡಿಸಿದರು?" })
        ];
    }
}
