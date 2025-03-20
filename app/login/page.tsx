import '@/app/globals.css';

import LoginForm from './form';

export default function LoginPage() {
  return (
    <div>
      <h1 className="flex flex-col gap-2 mx-auto text-center">Login</h1>
      <LoginForm />
    </div>
  );
}