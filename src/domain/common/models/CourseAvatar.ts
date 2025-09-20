type ColorPair = {
    bgColor: string;
    textColor: string;
}

const colorPairs: ColorPair[] = [
    { bgColor: '#60a5fa', textColor: '#ffffff' }, // Blue
    { bgColor: '#a78bfa', textColor: '#ffffff' }, // Purple
    { bgColor: '#34d399', textColor: '#ffffff' }, // Green
    { bgColor: '#f472b6', textColor: '#ffffff' }, // Pink
    { bgColor: '#fbbf24', textColor: '#000000' }, // Yellow
    { bgColor: '#f87171', textColor: '#ffffff' }, // Red
    { bgColor: '#22d3ee', textColor: '#000000' }, // Cyan
    { bgColor: '#fbbf24', textColor: '#000000' }  // Amber
];

export class CourseTheme {

    bgColor: string;
    textColor: string;
    initials: string;

    constructor({ bgColor, textColor, initials }: { bgColor: string; textColor: string; initials: string; }) {
        this.bgColor = bgColor;
        this.textColor = textColor;
        this.initials = initials;
    }

    static generate(id: number, name: string): CourseTheme {
        const colorPair = colorPairs[id % colorPairs.length];
        const initials = name.split(' ').map(part => part.charAt(0).toUpperCase()).join('').substring(0, 2);
        return new CourseTheme({ bgColor: colorPair.bgColor, textColor: colorPair.textColor, initials });
    }

}