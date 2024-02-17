import AlertError from "../components/AlertError";
import AuthenticationFields from "../components/AuthenticationFields";
import Root from "../components/Root";

export default function CreatePage({ error }: { error?: string }) {
	return (
		<Root>
			<form
				action="/create"
				method="post"
				style={{ width: "24rem" }}
				class="mx-auto mt-4"
			>
				<AuthenticationFields />
				{error && <AlertError>{error}</AlertError>}
				<button type="submit" class="btn btn-primary">
					Create
				</button>
			</form>
		</Root>
	);
}
