// Password check and session cookie for /files (functions/api/files/[action].ts). Nothing secret lives here:
// FILES_PASSWORD ("salt:hash", made by scripts/filesPassword.ts) and FILES_SESSION_SECRET are Cloudflare Pages secrets.
const encoder = new TextEncoder();
const hex = (buffer: ArrayBuffer) => [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

// Constant time, so the response time doesn't leak how much of a hash matched
const equal = (a: string, b: string) => a.length === b.length && [...a].reduce((diff, char, i) => diff | (char.charCodeAt(0) ^ b.charCodeAt(i)), 0) === 0;

// About 4ms of CPU, well inside the free plan's 10ms per request
const ITERATIONS = 30_000;
export const SESSION_SECONDS = 7 * 24 * 60 * 60;

export const hashPassword = async (password: string, salt: string) => hex(await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(salt), iterations: ITERATIONS },
    await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']),
    256,
));

export const checkPassword = async (password: string, stored: string) => {
    const [salt, hash] = stored.split(':');
    return Boolean(salt && hash) && equal(await hashPassword(password, salt), hash);
};

const sign = async (secret: string, data: string) => hex(await crypto.subtle.sign('HMAC',
    await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']),
    encoder.encode(data),
));

// "<expiry ms>.<HMAC of expiry>": only someone holding the secret can mint or extend one
export const createSession = async (secret: string, now = Date.now()) => {
    const expires = String(now + SESSION_SECONDS * 1000);
    return `${expires}.${await sign(secret, expires)}`;
};

export const checkSession = async (secret: string, token = '', now = Date.now()) => {
    const [expires, signature] = token.split('.');
    return Number(expires) > now && Boolean(signature) && equal(await sign(secret, expires), signature);
};
