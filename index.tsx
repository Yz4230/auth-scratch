import { count, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { logger } from "hono/logger";
import { SignJWT, jwtVerify } from "jose";
import { JWTExpired } from "jose/errors";
import { z } from "zod";
import Root from "./lib/components/Root";
import { SECRET, hashPassword, verifyPassword } from "./lib/crypto";
import { db } from "./lib/db";
import CreatePage from "./lib/pages/CreatePage";
import LoginPage from "./lib/pages/LoginPage";
import { users } from "./lib/schema";

export const COOKIE_TOKEN = "token";

export const app = new Hono();

const JWTCustomClaimsSchema = z.object({
	userId: z.number(),
});

type JWTCustomClaims = z.infer<typeof JWTCustomClaimsSchema>;

app.use(logger());

app.get("/", async (c) => {
	const token = getCookie(c, COOKIE_TOKEN);

	let username = null;
	if (token) {
		try {
			const { payload } = await jwtVerify(token, SECRET);
			const { userId } = JWTCustomClaimsSchema.parse(payload);

			const user = await db
				.select({ name: users.name })
				.from(users)
				.where(eq(users.id, userId))
				.limit(1)
				.then((rows) => rows[0]);

			username = user.name;
		} catch (e) {
			if (e instanceof JWTExpired) {
				return c.redirect("/login");
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
app.get("/logout", (c) => {
	setCookie(c, COOKIE_TOKEN, "");
	return c.redirect("/");
});

app.post("/create", async (c) => {
	const form = await c.req.formData();
	const username = form.get("username") as string;
	const password = form.get("password") as string;

	const existsUser = await db
		.select({ exists: count(sql`1`) })
		.from(users)
		.where(eq(users.name, username))
		.limit(1)
		.then((rows) => rows[0].exists > 0);

	if (existsUser) return c.html(<CreatePage error="User already exists" />);

	const hash = await hashPassword(password);
	await db.insert(users).values({ name: username, password: hash });

	return c.redirect("/login");
});

app.post("/login", async (c) => {
	const form = await c.req.formData();
	const username = form.get("username") as string;
	const password = form.get("password") as string;

	const user = await db
		.select()
		.from(users)
		.where(eq(users.name, username))
		.limit(1)
		.then((rows) => rows[0]);

	if (!user) return c.html(<LoginPage error="User not found" />);

	const isAuthenticated = await verifyPassword(password, user.password);

	if (!isAuthenticated) return c.html(<LoginPage error="Invalid password" />);

	const singer = new SignJWT({ userId: user.id } satisfies JWTCustomClaims);
	const token = await singer
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("15m")
		.sign(SECRET);

	setCookie(c, COOKIE_TOKEN, token, { httpOnly: true });

	return c.redirect("/");
});

export default app;
