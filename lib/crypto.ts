import env from "./env";

export const SECRET = Uint8Array.from(btoa(env.SECRET), (c) => c.charCodeAt(0));
export const PEPPER = Uint8Array.from(btoa(env.PEPPER), (c) => c.charCodeAt(0));

export async function hashPassword(password: string, salt: Uint8Array) {
  const passwordU8 = new TextEncoder().encode(password);
  const toHash = new Uint8Array([...passwordU8, ...salt, ...PEPPER]);
  const hash = await crypto.subtle.digest("SHA-256", toHash);
  return Buffer.from(hash).toString("hex");
}
