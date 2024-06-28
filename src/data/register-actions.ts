"use server";
import { z } from "zod";

const UserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

export const registerUser = async (prevState: any, queryData: FormData) => {
  const email = queryData.get("email") as string;
  const password = queryData.get("password") as string;

  const user = UserSchema.safeParse({ email, password });
  console.log(user);

  if (!user.success) {
    const emailError = user.error.issues.find(
      (issue) => issue.path[0] === "email"
    );
    const passwordError = user.error.issues.find(
      (issue) => issue.path[0] === "password"
    );

    if (emailError && passwordError) {
      return { email: emailError.message, password: passwordError.message };
    } else if (emailError) {
      return { email: emailError.message };
    } else if (passwordError) {
      return { password: passwordError.message };
    }
  }

  console.log("Email:", email, "\n", "Password:", password);

  return;
};
