'use client';

export default function AuthPrompt() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="mb-2">Please sign in to access NBA streams.</p>
      <button
        onClick={() => (window.location.href = '/login')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
      >
        Sign In
      </button>
      <p>Don&apos;t have an account?</p>
      <button
        onClick={() => (window.location.href = '/register')}
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
      >
        Register
      </button>
    </div>
  );
}