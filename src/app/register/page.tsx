import RegisterCard from "@/components/user-auth/register-form";

const RegisterPage: React.FC = () => {
  return (
    <main className="flex flex-col items-center">
      <h2 className="text-2xl font-bold m-2">Register Page</h2>
      <RegisterCard />
    </main>
  );
};

export default RegisterPage;
