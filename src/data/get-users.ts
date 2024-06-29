import { db } from "@/db";

export const getAllUsers = async () => {
  return await db.user.findMany();
};

export const getUserByEmail = async (email: string | undefined) => {
  return await db.user.findUnique({
    where: {
      email: email,
    },
  });
};
