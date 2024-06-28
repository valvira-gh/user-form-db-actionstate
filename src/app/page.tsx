import Link from "next/link";

const Home: React.FC = () => {
  return (
    <main className="flex flex-col items-center">
      <h2 className="text-2xl font-bold">Home</h2>
      <Link className="text-blue-500 text-xl" href={`/login`}>
        Login
      </Link>
      <Link className="text-blue-500 text-xl" href={`/register`}>
        Register
      </Link>
    </main>
  );
};

export default Home;
