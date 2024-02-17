import type { PropsWithChildren } from "hono/jsx";

export default function Root({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<head>
				<title>Auth Scratch</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link
					href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
					rel="stylesheet"
					integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
					crossorigin="anonymous"
				/>
			</head>
			<body>
				<main class="container">{children}</main>
				<script
					src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
					integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
					crossorigin="anonymous"
				/>
			</body>
		</html>
	);
}
