"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { getUserByEmail } from "@/data/get-users";

const bcrypt = require("bcrypt");
const saltRounds = 10;

// Schema for validating user input
const registerUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }).max(255, {
    message: "Email address must be at most 255 characters long.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(100, { message: "Password must be at most 100 characters long." }),
});

// TypeScript typings pulled from the registerUserSchema
type User = z.infer<typeof registerUserSchema>;

// REGISTER USER ACTION
export const registerUser = async (prevState: any, queryData: FormData) => {
  // Extract and validate query data by using FormData object and Zod schema
  const schemaResult = registerUserSchema.safeParse({
    email: queryData.get("email"),
    password: queryData.get("password"),
  });
  console.log("Schema result object: ", schemaResult); // { success: boolean, data: User || undefined }
  console.log("Schema result object data issues: ", schemaResult.error?.issues);
  /** console: undefined || { path: ['email'], message: 'Invalid email address.' } AND / OR { path: ['password'], message: 'Password must be at least 8 characters long.' } */

  if (!schemaResult.success) {
    // Create an errors object with each field's error message by reduce() method
    const errors = schemaResult.error.issues.reduce(
      (accumulator: any, issue: any) => {
        accumulator[issue.path[0]] = issue.message;
        return accumulator;
      },
      {}
    );
    console.log("Errors object: ", errors);
    /** console: { email: 'Invalid email address.' }
     * IF ALSO PASSWORD IS INVALID
     * console: password: 'Password must be at least 8 characters long.' } */
    return {
      success: false,
      errors,
    };
  }

  const user = schemaResult.data;
  console.log("User object: ", user); // console: { email: 'test@test, password: 'password' }

  // Check if the user already exists in the database
  const userExists = await getUserByEmail(user.email);
  console.log("User exists: ", userExists);
  /**
  IF EXISTS, console: { email: 'test@test', password: 'password' }
  IF NOT EXISTS, console: null */
  // So if the user exists, the userExists object will contain the user object,
  // otherwise it will be null and the process will continue.

  if (userExists !== null) {
    return { success: false, message: "User already exists." };
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);
  console.log("Hashed password: ", hashedPassword);

  // Store the user in the database
  const storedUser = await db.user.create({
    data: { email: user.email },
  });
  console.log("Stored user: ", storedUser); // returns { id: string, email: string, name: null }

  // Store the hashed password in the database into a separate table.
  // Relation between tables is established by 'userId',
  // so the id must be kept as a secret from the client.
  const storedPassword = await db.password.create({
    data: {
      userId: storedUser.id,
      hash: hashedPassword,
    },
  });
  console.log("Stored password: ", storedPassword); // returns { id: string, userId: string, hash: string }

  if (!storedUser) {
    return { success: false, message: "Failed to store user." };
  } else if (!storedPassword) {
    return { success: false, message: "Failed to store password." };
  }

  // Revalidate cache, so that password is not stored in the cache and shown in URL.
  revalidatePath("/register-user");
  redirect("/login");

  return { success: true, message: "User registered successfully!" };
};
