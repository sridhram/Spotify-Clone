import React from 'react';
import { signIn } from 'next-auth/react';

const Login = () => {
  return (
    <main>
      <button
        onClick={() => {
          signIn('spotify', { callbackUrl: '/' });
        }}
      >
        Login
      </button>
    </main>
  );
};

export default Login;