"use server";
import { z } from "zod";
import { User, Password } from "@prisma/client";
import { getUserByEmail } from "@/data/get-users";
import { getPasswordByUserId } from "@/data/get-password";

const bcrypt = require("bcrypt");
import { db } from "@/db";

const FormData = z.object({
  email: z.string(),
  password: z.string(),
});

export const loginUser = async (prevState: any, queryData: FormData) => {
  const formData = FormData.safeParse({
    email: queryData.get("email"),
    password: queryData.get("password"),
  });
  console.log("Zod object of form data after parsing:", formData);

  if (!formData.success) {
    return { message: "Something went wrong with the form data." };
  } else if (formData.data.email === undefined || null) {
    return { message: "Email is required." };
  } else if (formData.data.password === undefined || null) {
    return { message: "Password is required." };
  }

  if (
    typeof formData.data.email !== "string" ||
    typeof formData.data.password !== "string"
  ) {
    return { message: "Invalid form data." };
  }

  const user = await getUserByEmail(formData.data.email);
  console.log("User:", user);
  if (user === null) {
    return { message: "User not found." };
  }

  const passwordObject = await getPasswordByUserId(user.id);
  console.log("Password:", passwordObject);
  if (passwordObject === null) {
    return { message: "Password not found." };
  } else if (typeof passwordObject.hash !== "string") {
    return {
      message:
        "Hashed password that was get from db is unexpectedly not type of 'string', wtf?",
    };
  } else {
    const match = await bcrypt.compare(
      formData.data.password,
      passwordObject.hash
    );
    console.log("Match:", match);

    if (match === false) {
      return { message: "Password is incorrect.", success: false };
    } else {
      return { message: "Login successful!", success: true };
    }
  }
};
