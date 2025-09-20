// DateFmt.ts
export class DateFmt {
    static date(date: Date): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return date.toLocaleDateString('en-US', options);
    }

    static datetime(date: Date): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return date.toLocaleString('en-US', options);
    }

    static time(date: Date): string {
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return date.toLocaleTimeString('en-US', options);
    }

    /**
     * Shows "MMM d" for dates in the current year,
     * and "MMM d, yyyy" for dates in other years.
     * Optionally append time.
     */
    static relativeTime(
        date: Date,
        opts: { now?: Date; includeTime?: boolean } = {}
    ): string {
        const now = opts.now ?? new Date();
        const sameYear = date.getFullYear() === now.getFullYear();

        const datePart = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            ...(sameYear ? {} : { year: 'numeric' }),
        });

        if (!opts.includeTime) return datePart;

        const timePart = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        return `${datePart} • ${timePart}`;
    }
}
