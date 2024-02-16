import type { PropsWithChildren } from "hono/jsx";

export default function AlertError({ children }: PropsWithChildren) {
	return (
		<div class="alert alert-danger" role="alert">
			{children}
		</div>
	);
}
