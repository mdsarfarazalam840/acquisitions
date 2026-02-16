import { useState, type FormEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUserById, updateUserById } from '../api/users';
import { useAuth } from '../context/useAuth';
import { toErrorMessage } from '../utils';

const DashboardPage = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');

  const userId = user?.id;

  const profileQuery = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getUserById(userId as number),
    enabled: Boolean(userId),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: number; name: string }) =>
      updateUserById(payload.id, { name: payload.name }),
    onSuccess: (data) => {
      setUser(data.user);
      setName(data.user.name);
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) return;
    updateMutation.mutate({ id: userId, name });
  };

  return (
    <section className="panel">
      <h1>Dashboard</h1>
      <p className="sub">
        Authenticated session is maintained by httpOnly cookie.
      </p>

      <div className="badge-row">
        <span className="role-tag">Role: {user?.role}</span>
        <span className="role-tag">User ID: {user?.id}</span>
      </div>

      {profileQuery.isPending && <p>Loading profile...</p>}
      {profileQuery.isError && (
        <p className="inline-error">{toErrorMessage(profileQuery.error)}</p>
      )}
      {profileQuery.data?.user && (
        <div className="card-grid">
          <article className="card">
            <h3>Current Profile</h3>
            <p>
              <strong>Name:</strong> {profileQuery.data.user.name}
            </p>
            <p>
              <strong>Email:</strong> {profileQuery.data.user.email}
            </p>
            <p>
              <strong>Role:</strong> {profileQuery.data.user.role}
            </p>
          </article>

          <article className="card">
            <h3>Update Name</h3>
            <form onSubmit={onSubmit} className="form-grid">
              <label>
                New Name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>
              <button
                className="btn"
                type="submit"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Updating...' : 'Update'}
              </button>
            </form>
            {updateMutation.isError && (
              <p className="inline-error">
                {toErrorMessage(updateMutation.error)}
              </p>
            )}
          </article>
        </div>
      )}
    </section>
  );
};

export { DashboardPage };
