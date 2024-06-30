"use client";

import { useActionState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { loginUser } from "@/lib/login-actions";
import { ThreeDots } from "react-loader-spinner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const initialErrorState = {
  message: "",
  success: false,
};

const LoginForm = () => {
  const [error, submitAction, isPending] = useActionState(
    loginUser,
    initialErrorState
  );

  return (
    <form action={submitAction} className="">
      <div className="flex flex-col space-y-1">
        <div className="flex flex-col space-y-1">
          <Label htmlFor="email">Email:</Label>
          <Input type="text" name="email" />
        </div>
        <div className="flex flex-col space-y-1">
          <Label htmlFor="password">Password:</Label>
          <Input type="password" name="password" />
        </div>
      </div>

      <div className="flex flex-row justify-between items-center w-full mt-2">
        {error && (
          <CardDescription
            className={`${
              error.success ? "text-green-500" : "text-red-500"
            } text-md`}
          >
            {error.message}
          </CardDescription>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <ThreeDots height={40} width={40} color={"gray"} />
          ) : (
            "Login"
          )}
        </Button>
      </div>
    </form>
  );
};

const LoginCard = () => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Login User</CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter>
        <p className="text-slate-400">
          If you don't have an account, <br />
          <Link href="/register" className="text-blue-500 font-semibold">
            Register user
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
