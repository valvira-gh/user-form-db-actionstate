"use server";
import { z } from "zod";
import { User, Password } from "@prisma/client";
import { getUserByEmail } from "@/data/get-users";
import { getPasswordByUserId } from "@/data/get-password";
import { updateUser } from "@/data/update-user";

const bcrypt = require("bcrypt");

const FormData = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password is invalid." })
    .max(100, { message: "Password is invalid." }),
});

export const loginUser = async (prevState: any, queryData: FormData) => {
  // Get the form data from the query data
  // and parse it with the FormData schema
  const result = FormData.safeParse({
    email: queryData.get("email"),
    password: queryData.get("password"),
  });
  console.log("Zod safeParse result:", result);

  if (!result.success) {
    const errors = result.error.issues.reduce((acc: any, issue: any) => {
      acc[issue.path[0]] = issue.message;
      return acc;
    }, {});
    return { success: false, errors };
  }

  const formData = result.data;

  console.log("FormData:", formData);

  // Check if the email and password are provided
  // If not
  if (!formData.email === undefined || null) {
    return { message: "Email is required" };
  } else if (formData.password === undefined || null) {
    return { message: "Password is required" };
  }

  const user: User | null = await getUserByEmail(formData.email);
  console.log("User:", user);
  if (user === null) {
    return { message: "User not found." };
  }

  const passwordTable = await getPasswordByUserId(user.id);
  console.log("Password:", passwordTable);
  const hashedPassword = passwordTable?.hash;

  if (hashedPassword === undefined) {
    return { message: "Password not found." };
  }

  const match = await bcrypt.compare(formData.password, hashedPassword);

  if (match === false) {
    return { message: "Password is incorrect.", success: false };
  } else {
    const updatedUser = await updateUser(user);
    console.log("Updated user:", updatedUser);
    return { message: "Login successful!", success: true };
  }
};
