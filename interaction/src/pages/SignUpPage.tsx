import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { signUp } from '../api/auth';
import { useAuth } from '../context/useAuth';
import { toErrorMessage } from '../utils';

const SignUpPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      setUser(data.user);
      navigate('/dashboard');
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ name, email, password });
  };

  return (
    <section className="panel">
      <h1>Create Account</h1>
      <p className="sub">
        This calls <code>/api/auth/sign-up</code> and stores session cookies.
      </p>
      <form onSubmit={onSubmit} className="form-grid">
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
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
          {mutation.isPending ? 'Creating...' : 'Create Account'}
        </button>
      </form>
      {mutation.isError && (
        <p className="inline-error">{toErrorMessage(mutation.error)}</p>
      )}
      <p className="footnote">
        Already registered? <Link to="/sign-in">Sign in</Link>
      </p>
    </section>
  );
};

export { SignUpPage };
