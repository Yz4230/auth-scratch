import env from "./env";

export const SECRET = Uint8Array.from(btoa(env.SECRET), (c) => c.charCodeAt(0));
export const PEPPER = Uint8Array.from(btoa(env.PEPPER), (c) => c.charCodeAt(0));

export async function hashPassword(password: string, salt: Uint8Array) {
	const passwordU8 = new TextEncoder().encode(password);
	const toHash = new Uint8Array([...passwordU8, ...salt, ...PEPPER]);
	const hash = await crypto.subtle.digest("SHA-256", toHash);
	return Buffer.from(hash).toString("hex");
}

export async function verifyPassword(
	given: string,
	correct: string,
	salt: Uint8Array,
) {
	const hash = await hashPassword(given, salt);

	let equal = true;
	for (let i = 0; i < hash.length; i++) {
		if (hash[i] !== correct[i]) {
			equal = false;
			// Don't break here to avoid timing attacks
		}
	}

	return equal;
}
