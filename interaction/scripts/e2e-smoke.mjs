import { randomUUID } from 'node:crypto';

const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

const run = async () => {
  const email = `smoke-${randomUUID()}@example.com`;
  const password = 'Smoke@1234';

  const signup = await fetch(`${baseUrl}/api/auth/sign-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Smoke User', email, password }),
  });

  if (!signup.ok) {
    throw new Error(`sign-up failed: ${signup.status}`);
  }

  const cookie = signup.headers.get('set-cookie');
  if (!cookie) {
    throw new Error('missing auth cookie in sign-up response');
  }

  const cookieHeader = cookie.split(';')[0];

  const me = await fetch(`${baseUrl}/api/users/1`, {
    method: 'GET',
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (me.status !== 200 && me.status !== 403 && me.status !== 404) {
    throw new Error(`unexpected protected endpoint response: ${me.status}`);
  }

  const signout = await fetch(`${baseUrl}/api/auth/sign-out`, {
    method: 'POST',
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (!signout.ok) {
    throw new Error(`sign-out failed: ${signout.status}`);
  }

  console.log('Interaction smoke e2e passed');
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
