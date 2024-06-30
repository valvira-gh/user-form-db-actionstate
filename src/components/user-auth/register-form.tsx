"use client";

import { useActionState } from "react";
import Link from "next/link";

import { registerUser } from "@/lib/register-actions";
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

const RegisterForm = () => {
  const [state, formAction, pending] = useActionState(registerUser, null);

  return (
    <form action={formAction} className="">
      <div className="flex flex-col space-y-1">
        <div className="flex flex-col space-y-1">
          <Label htmlFor="email">Email:</Label>
          <Input type="text" name="email" />
          {state?.errors?.email && (
            <CardDescription className="text-red-500  m-b1">
              {state.errors.email}
            </CardDescription>
          )}
        </div>
        <div className="flex flex-col space-y-1">
          <Label htmlFor="password">Password:</Label>
          <Input type="password" name="password" />
          {state?.errors?.password && (
            <CardDescription className="text-red-500 ">
              {state.errors.password}
            </CardDescription>
          )}
        </div>
      </div>

      {state && !state.errors && (
        <p
          className={`${
            state.success ? "text-green-500" : "text-red-500"
          } m-1 `}
        >
          {state.message}
        </p>
      )}

      <div className="flex flex-row justify-end m-2">
        <Button type="submit" disabled={pending}>
          {pending ? (
            <ThreeDots height={40} width={40} color={"gray"} />
          ) : (
            "Register"
          )}
        </Button>
      </div>
    </form>
  );
};

const RegisterCard = () => {
  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Register User</CardTitle>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter>
        <p className="text-slate-400">
          If you already have an account, <br />
          <Link href="/login" className="text-blue-500 font-semibold">
            Login user
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterCard;
