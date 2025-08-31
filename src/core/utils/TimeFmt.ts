export class TimeFmt {

    // Converts seconds into long format: e.g., "1 hour 2 minutes 5 seconds"
    static formatLong(seconds: number): string {
        seconds = Math.round(seconds); // Ensure whole seconds

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const timeParts: string[] = [];

        if (hours > 0) {
            timeParts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
        }
        if (minutes > 0) {
            timeParts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
        }
        if (remainingSeconds > 0 || timeParts.length === 0) {
            timeParts.push(`${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`);
        }

        return timeParts.join(' ');
    }

    // Short format like "1h 2m 5s"
    static format(seconds: number): string {
        seconds = Math.round(seconds); // Round to nearest second

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const timeParts: string[] = [];

        if (hours > 0) {
            timeParts.push(`${hours}h`);
        }
        if (minutes > 0) {
            timeParts.push(`${minutes}m`);
        }
        if (remainingSeconds > 0 || timeParts.length === 0) {
            timeParts.push(`${remainingSeconds}s`);
        }

        return timeParts.join(' ');
    }

    // Format as mm:ss
    static formatMinutesSeconds(seconds: number): string {
        seconds = Math.round(seconds); // Round to nearest second

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

}
