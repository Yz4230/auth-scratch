import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.get("/", (c) => {
	return c.html(
		<html lang="en">
			<head>
				<title>Hello, World!</title>
			</head>
			<body>
				<h1>Hello, World!</h1>
			</body>
		</html>,
	);
});

export default app;
