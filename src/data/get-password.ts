import { db } from "@/db";

export const getPasswordByUserId = async (id: string) => {
  return await db.password.findFirst({
    where: { userId: id },
  });
};
