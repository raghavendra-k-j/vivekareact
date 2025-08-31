
export class QuestionSpeechTextService {

    question(question: string): string {
        return this.textContent(question);
    }

    choice(position: number, choice: string): string {
        choice = this.textContent(choice);
        const letter = String.fromCharCode(64 + position);
        return `Option ${letter}: ${choice}`;
    }

    textContent(html: string): string {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;

        // Handle fill-in-the-blanks
        const fillBlanks = tempElement.querySelectorAll('span[data-tag-fill-blank]');
        fillBlanks.forEach((el, index) => {
            el.textContent = `Fill up ${index + 1}`;
        });

        // Handle inline LaTeX
        const iLaTexElements = tempElement.querySelectorAll('span[data-tag-ilatex]');
        iLaTexElements.forEach(el => {
            const latexValue = el.getAttribute('data-tag-ilatex');
            if (latexValue) el.textContent = latexValue;
        });

        // Handle block LaTeX
        const bLaTexElements = tempElement.querySelectorAll('div[data-tag-blatex]');
        bLaTexElements.forEach(el => {
            const latexValue = el.getAttribute('data-tag-blatex');
            if (latexValue) el.textContent = latexValue;
        });

        // Return cleaned text
        return tempElement.textContent || '';
    }





}