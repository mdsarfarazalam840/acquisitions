import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { signIn } from '../api/auth';
import { useAuth } from '../context/useAuth';
import { toErrorMessage } from '../utils';

const SignInPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      setUser(data.user);
      navigate('/dashboard');
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <section className="panel">
      <h1>Sign In</h1>
      <p className="sub">
        Use your account to access protected endpoints with cookie auth.
      </p>
      <form onSubmit={onSubmit} className="form-grid">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button className="btn" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      {mutation.isError && (
        <p className="inline-error">{toErrorMessage(mutation.error)}</p>
      )}
      <p className="footnote">
        New here? <Link to="/sign-up">Create an account</Link>
      </p>
    </section>
  );
};

export { SignInPage };
