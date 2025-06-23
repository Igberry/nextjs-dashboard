// lib/safeFetch.ts
export async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        console.error('Database fetch error:', error);
        return fallback;
    }
}
