// Makes the FILES_PASSWORD secret for /files: node scripts/filesPassword.ts "your password"
// With no password it makes up a random one. Checks the login code still works before printing anything.
import assert from 'node:assert/strict';
import { checkPassword, checkSession, createSession, hashPassword } from '../src/utils/filesAuth.ts';

const password = process.argv[2] ?? Buffer.from(crypto.getRandomValues(new Uint8Array(18))).toString('base64url');
const salt = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('hex');
const stored = `${salt}:${await hashPassword(password, salt)}`;

assert(await checkPassword(password, stored));
assert(!await checkPassword(`${password}x`, stored));
assert(!await checkPassword(password, 'not-a-hash'));
const token = await createSession('secret');
assert(await checkSession('secret', token));
assert(!await checkSession('other secret', token));
assert(!await checkSession('secret', token.replace(/^\d/, '9')));
assert(!await checkSession('secret', token, Date.now() + 8 * 24 * 60 * 60 * 1000));
assert(!await checkSession('secret', undefined));

if (!process.argv[2]) console.log(`Password: ${password}`);
console.log(`FILES_PASSWORD: ${stored}`);
