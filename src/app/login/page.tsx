import LoginCard from "@/components/user-auth/login-form";

const LoginPage: React.FC = () => {
  return (
    <main className="flex flex-col items-center">
      <h2 className="text-2xl font-bold m-2">Login Page</h2>
      <LoginCard />
    </main>
  );
};

export default LoginPage;
