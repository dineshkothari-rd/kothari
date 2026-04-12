import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen flex items-center justify-center px-4 py-16 transition-colors duration-300">
      <LoginForm />
    </div>
  );
}
