import { useMemo, useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUserById, getAllUsers, updateUserById } from '../api/users';
import { useAuth } from '../context/useAuth';
import { toErrorMessage } from '../utils';

const UsersPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'user'>('user');

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    enabled: user?.role === 'admin',
  });

  const refreshUsers = () =>
    queryClient.invalidateQueries({ queryKey: ['users'] });

  const updateMutation = useMutation({
    mutationFn: (payload: {
      id: number;
      name: string;
      role: 'admin' | 'user';
    }) =>
      updateUserById(payload.id, { name: payload.name, role: payload.role }),
    onSuccess: () => {
      setEditingId(null);
      setEditName('');
      setEditRole('user');
      refreshUsers();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUserById,
    onSuccess: () => {
      refreshUsers();
    },
  });

  const isBusy = useMemo(
    () => updateMutation.isPending || deleteMutation.isPending,
    [deleteMutation.isPending, updateMutation.isPending]
  );

  const startEdit = (id: number, name: string, role: 'admin' | 'user') => {
    setEditingId(id);
    setEditName(name);
    setEditRole(role);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditRole('user');
  };

  const onSubmitEdit = (event: FormEvent<HTMLFormElement>, id: number) => {
    event.preventDefault();
    updateMutation.mutate({ id, name: editName, role: editRole });
  };

  if (user?.role !== 'admin') {
    return (
      <section className="panel">
        <h1>Users</h1>
        <p className="inline-error">Admin access required.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h1>All Users</h1>
          <p className="sub">
            Admin endpoint controls for{' '}
            <code>GET/PUT/DELETE /api/users/:id</code>
          </p>
        </div>
        <button className="btn ghost" onClick={refreshUsers} disabled={isBusy}>
          Refresh
        </button>
      </div>

      {usersQuery.isPending && <p>Loading users...</p>}
      {usersQuery.isError && (
        <p className="inline-error">{toErrorMessage(usersQuery.error)}</p>
      )}
      {updateMutation.isError && (
        <p className="inline-error">{toErrorMessage(updateMutation.error)}</p>
      )}
      {deleteMutation.isError && (
        <p className="inline-error">{toErrorMessage(deleteMutation.error)}</p>
      )}

      {usersQuery.data?.users && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersQuery.data.users.map((currentUser) => {
                const isEditing = editingId === currentUser.id;
                const safeRole =
                  currentUser.role === 'admin'
                    ? 'admin'
                    : ('user' as 'admin' | 'user');

                return (
                  <tr key={currentUser.id}>
                    <td>{currentUser.id}</td>
                    <td>
                      {isEditing ? (
                        <input
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                          className="cell-input"
                        />
                      ) : (
                        currentUser.name
                      )}
                    </td>
                    <td>{currentUser.email}</td>
                    <td>
                      {isEditing ? (
                        <select
                          value={editRole}
                          onChange={(event) =>
                            setEditRole(event.target.value as 'admin' | 'user')
                          }
                          className="cell-input"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      ) : (
                        currentUser.role
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <form
                          onSubmit={(event) =>
                            onSubmitEdit(event, currentUser.id)
                          }
                          className="row-actions"
                        >
                          <button
                            className="btn mini"
                            type="submit"
                            disabled={isBusy}
                          >
                            Save
                          </button>
                          <button
                            className="btn ghost mini"
                            type="button"
                            onClick={cancelEdit}
                            disabled={isBusy}
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <div className="row-actions">
                          <button
                            className="btn mini"
                            type="button"
                            onClick={() =>
                              startEdit(
                                currentUser.id,
                                currentUser.name,
                                safeRole
                              )
                            }
                            disabled={isBusy}
                          >
                            Edit
                          </button>
                          <button
                            className="btn danger mini"
                            type="button"
                            onClick={() =>
                              deleteMutation.mutate(currentUser.id)
                            }
                            disabled={isBusy}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export { UsersPage };
