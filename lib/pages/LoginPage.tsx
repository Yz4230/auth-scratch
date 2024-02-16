import Root from "../components/Root";
import AlertError from "../components/AlertError";
import AuthenticationFields from "../components/AuthenticationFields";

export default function LoginPage({ error }: { error?: string }) {
	return (
		<Root>
			<form
				action="/login"
				method="post"
				style={{ width: "24rem" }}
				class="mx-auto mt-4"
			>
				<AuthenticationFields />
				<p class="text-muted">
					If you don't have an account, you can <a href="/create">create</a>{" "}
					here.
				</p>
				{error && <AlertError>{error}</AlertError>}
				<button type="submit" class="btn btn-primary">
					Login
				</button>
			</form>
		</Root>
	);
}
