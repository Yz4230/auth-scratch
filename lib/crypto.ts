import env from "./env";

export const SECRET = Uint8Array.from(btoa(env.SECRET), (c) => c.charCodeAt(0));
export const SALT = Uint8Array.from(btoa(env.SALT), (c) => c.charCodeAt(0));

export async function hashPassword(password: string) {
	const buffer = new TextEncoder().encode(password);
	const hash = await crypto.subtle.digest("SHA-256", buffer);
	const hashed = new Uint8Array(hash);
	const salted = new Uint8Array([...SALT, ...hashed]);
	const saltedHex = Buffer.from(salted).toString("hex");
	return saltedHex;
}

export async function verifyPassword(given: string, correct: string) {
	const hash = await hashPassword(given);

	let equal = true;
	for (let i = 0; i < hash.length; i++) {
		if (hash[i] !== correct[i]) {
			equal = false;
			// Don't break here to avoid timing attacks
		}
	}

	return equal;
}
