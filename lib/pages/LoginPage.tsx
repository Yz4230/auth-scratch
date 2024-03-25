import AlertError from "../components/AlertError";
import AuthenticationFields from "../components/AuthenticationFields";
import Root from "../components/Root";

type Props = {
  csrfToken: string;
  error?: string;
};

export default function LoginPage({ csrfToken, error }: Props) {
  return (
    <Root>
      <form
        action="/login"
        method="post"
        style={{ width: "24rem" }}
        class="mx-auto mt-4"
      >
        <AuthenticationFields />
        <input type="hidden" name="csrf" value={csrfToken} />
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
