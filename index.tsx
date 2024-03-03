import { count, eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { logger } from "hono/logger";
import Root from "./lib/components/Root";
import { hashPassword } from "./lib/crypto";
import { db } from "./lib/db";
import CreatePage from "./lib/pages/CreatePage";
import LoginPage from "./lib/pages/LoginPage";
import { sessions, users } from "./lib/schema";
import { isString } from "./lib/utils";

const COOKIE_SESSION = "session";
const SESSION_EXPIRATION = 1000 * 60 * 5; // 5 minutes for development

export const app = new Hono();

app.use(logger());

app.get("/", async (c) => {
  const sessionCookie = getCookie(c, COOKIE_SESSION);

  let username: string | undefined;
  if (sessionCookie) {
    const userSession = await db
      .select()
      .from(users)
      .innerJoin(sessions, eq(users.id, sessions.userId))
      .where(eq(sessions.sessionKey, sessionCookie))
      .then((rows) => rows.at(0));
    if (userSession) {
      if (userSession.sessions.expires < Date.now()) {
        await db.delete(sessions).where(eq(sessions.sessionKey, sessionCookie));
      } else {
        const newExpiration = Date.now() + SESSION_EXPIRATION;
        await db
          .update(sessions)
          .set({ expires: newExpiration })
          .where(eq(sessions.sessionKey, sessionCookie));
        username = userSession.users.name;
      }
    }
  }

  return c.html(
    <Root>
      <div class="text-center">
        <h1 class="display-4">Welcome to the app</h1>
        {username ? (
          <p class="text-success">
            Welcome back, <strong>{username}</strong>!
            <br />
            <a href="/logout">Logout</a>
          </p>
        ) : (
          <p class="text-danger">
            You are not logged in. Please <a href="/login">login</a>
          </p>
        )}
      </div>
    </Root>,
  );
});

app.get("/login", (c) => c.html(<LoginPage />));
app.get("/create", (c) => c.html(<CreatePage />));
app.get("/logout", async (c) => {
  const sessionCookie = getCookie(c, COOKIE_SESSION);
  if (sessionCookie) {
    await db.delete(sessions).where(eq(sessions.sessionKey, sessionCookie));
    setCookie(c, COOKIE_SESSION, "", { maxAge: 0 });
  }
  return c.redirect("/");
});

app.post("/create", async (c) => {
  const form = await c.req.formData();
  const username = form.get("username");
  const password = form.get("password");
  if (!isString(username) || !isString(password))
    return c.html(<CreatePage error="Invalid input" />);

  const existsUser = await db
    .select({ exists: count() })
    .from(users)
    .where(eq(users.name, username))
    .limit(1)
    .then((rows) => rows.at(0)?.exists === 1);

  if (existsUser) return c.html(<CreatePage error="User already exists" />);

  const saltU8 = new Uint8Array(16);
  crypto.getRandomValues(saltU8);

  const hash = await hashPassword(password, saltU8);
  const saltHex = Buffer.from(saltU8).toString("hex");
  await db.insert(users).values({
    name: username,
    passwordHash: hash,
    salt: saltHex,
  });

  return c.redirect("/login");
});

app.post("/login", async (c) => {
  const form = await c.req.formData();
  const username = form.get("username");
  const password = form.get("password");
  if (!isString(username) || !isString(password))
    return c.html(<LoginPage error="Invalid input" />);

  const user = await db
    .select()
    .from(users)
    .where(eq(users.name, username))
    .limit(1)
    .then((rows) => rows[0]);

  if (!user) return c.html(<LoginPage error="User not found" />);

  const saltU8 = new Uint8Array(Buffer.from(user.salt, "hex"));
  const isAuthenticated = await hashPassword(password, saltU8).then(
    (hash) => hash === user.passwordHash,
  );

  if (!isAuthenticated) return c.html(<LoginPage error="Invalid password" />);

  const sessionKey = crypto.randomUUID();
  const expires = Date.now() + SESSION_EXPIRATION;
  await db.insert(sessions).values({
    userId: user.id,
    sessionKey,
    data: "{}",
    expires,
  });
  setCookie(c, COOKIE_SESSION, sessionKey, {
    maxAge: SESSION_EXPIRATION / 1000,
  });

  return c.redirect("/");
});

export default app;
