import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { signOut } from '../api/auth';
import { useAuth } from '../context/useAuth';
import { toErrorMessage } from '../utils';

const NavBar = () => {
  const { user, isAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      setUser(null);
      navigate('/sign-in');
    },
  });

  return (
    <header className="nav-shell">
      <div className="nav-row">
        <Link className="brand" to="/">
          Acquisitions Interaction
        </Link>
        <nav className="links">
          {!isAuthenticated && <NavLink to="/sign-in">Sign In</NavLink>}
          {!isAuthenticated && <NavLink to="/sign-up">Sign Up</NavLink>}
          {isAuthenticated && <NavLink to="/dashboard">Dashboard</NavLink>}
          {isAuthenticated && user?.role === 'admin' && (
            <NavLink to="/users">Users</NavLink>
          )}
        </nav>
        <div className="actions">
          {isAuthenticated ? (
            <button
              className="btn ghost"
              onClick={() => signOutMutation.mutate()}
              disabled={signOutMutation.isPending}
            >
              {signOutMutation.isPending ? 'Signing out...' : 'Sign Out'}
            </button>
          ) : (
            <span className="role-tag">guest</span>
          )}
        </div>
      </div>
      {signOutMutation.isError && (
        <p className="inline-error">{toErrorMessage(signOutMutation.error)}</p>
      )}
    </header>
  );
};

export { NavBar };
