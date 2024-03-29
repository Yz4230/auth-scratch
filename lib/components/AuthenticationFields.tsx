export default function AuthenticationFields() {
  return (
    <>
      <div class="mb-3">
        <label for="username" class="form-label">
          Email address
        </label>
        <input
          type="email"
          class="form-control"
          id="username"
          name="username"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">
          Password
        </label>
        <input
          type="password"
          class="form-control"
          id="password"
          name="password"
          required
        />
      </div>
    </>
  );
}
