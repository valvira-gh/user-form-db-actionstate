"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getUserByEmail } from "@/data/get-users";

const bcrypt = require("bcrypt");
const saltRounds = 10;

// Schema for validating user input
const UserSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }).max(255, {
    message: "Email address must be at most 255 characters long.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(100, { message: "Password must be at most 100 characters long." }),
});

// TypeScript typings pulled from the registerUserSchema
type User = z.infer<typeof UserSchema>;

// REGISTER USER ACTION
export const registerUser = async (prevState: any, queryData: FormData) => {
  // Extract and validate query data by using FormData object and Zod schema
  const schemaResult = UserSchema.safeParse({
    email: queryData.get("email"),
    password: queryData.get("password"),
  });

  if (!schemaResult.success) {
    const errors = schemaResult.error.issues.reduce(
      (accumulator: any, issue: any) => {
        accumulator[issue.path[0]] = issue.message;
        return accumulator;
      },
      {}
    );
    return {
      success: false,
      errors,
    };
  }

  const user = schemaResult.data;

  // Check if the user already exists in the database
  const userExists = await getUserByEmail(user.email);
  if (userExists !== null) {
    return { success: false, message: "User already exists." };
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);

  // Store the user in the database
  const storedUser = await db.user.create({
    data: { email: user.email },
  });

  // Store the hashed password in the database into a separate table
  const storedPassword = await db.password.create({
    data: {
      userId: storedUser.id,
      hash: hashedPassword,
    },
  });

  if (!storedUser || !storedPassword) {
    return { success: false, message: "Failed to store user or password." };
  }

  // Revalidate cache and redirect
  revalidatePath("/register-user");
  redirect("/login");

  return { success: true, message: "User registered successfully!" };
};
