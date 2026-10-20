# Manual test checklist

- [ ] Register with a valid name, email, and password.
- [ ] Try registering the same email again; expect `409`.
- [ ] Try a password shorter than 8 characters; expect `422`.
- [ ] Log in with correct credentials; receive an access token.
- [ ] Log in with incorrect credentials; expect `401`.
- [ ] Call `/api/v1/auth/me` without a token; expect `401`.
- [ ] Create, list, update, filter, and delete a task.
- [ ] Register a second user and confirm they cannot see the first user's tasks.
- [ ] Call `/api/v1/admin/users` as a normal user; expect `403`.
- [ ] Promote a test account to `admin` locally and verify admin-only access.
- [ ] Open `/docs` and inspect generated OpenAPI documentation.
