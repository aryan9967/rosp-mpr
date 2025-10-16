// SignUpPage.jsx
import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <div>
      <h1>Register</h1>
      <SignUp afterSignUpUrl="/profile" />
    </div>
  );
};

export default SignUpPage;
