import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";

import prismadb from "@/lib/prismadb";

const serverAuth = async (req: NextApiRequest) => {
  const session = await getSession({ req });

  console.log("Session Not here***", session)
  if (!session?.user?.email) {
    throw new Error("Not signed in or invalid session");
  }

  console.log("Session***", session)

  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!currentUser) {
    throw new Error("User not found in database");
  }

  console.log("Current user***", currentUser)

  return { currentUser };
};

export default serverAuth;
