export async function withMinDelay<T>(promise: Promise<T>, minDelayMs = 0): Promise<T> {
    const start = Date.now();

    const result = await promise;

    const elapsed = Date.now() - start;
    const remaining = minDelayMs - elapsed;

    if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
    }

    return result;
}


export function mockDelay<T>(minDelayMs = 1000): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve({} as T), minDelayMs));
}