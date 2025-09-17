export async function copyToClipboard({text}: {text: string}): Promise<void> {
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
    } else {
        throw new Error('Clipboard API not supported');
    }
}