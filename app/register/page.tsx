import '@/app/globals.css';

import RegisterForm from './form';

export default function RegisterPage() {
  return (
    <div>
      <h1 className="flex flex-col gap-2 mx-auto text-center">Register</h1>
      <RegisterForm />
    </div>
  );
}