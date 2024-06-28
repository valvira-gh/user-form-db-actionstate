"use client";

import { useActionState } from "react";
import { registerUser } from "@/data/register-actions";

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
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <Label htmlFor="email">Email:</Label>
          <Input type="text" name="email" />
          {state?.email && (
            <CardDescription className="text-red-500">
              {state.email}
            </CardDescription>
          )}
        </div>
        <div className="flex flex-col space-y-1">
          <Label htmlFor="password">Password:</Label>
          <Input type="password" name="password" />
          {state?.password && (
            <CardDescription className="text-red-500 font-semibold">
              {state.password}
            </CardDescription>
          )}
        </div>
      </div>
      <div className="flex flex-row justify-end m-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Registering..." : "Register"}
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
    </Card>
  );
};

export default RegisterCard;
