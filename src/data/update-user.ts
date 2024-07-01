import { db } from "@/db";

export const updateUser = async (user: {
  id: string | undefined;
  name: string | null;
  email: string | undefined;
  isLogged: boolean;
}) => {
  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      name: user.name,
      email: user.email,
      isLogged: !user.isLogged,
    },
  });

  return updatedUser;
};
