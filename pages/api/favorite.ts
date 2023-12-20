import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { currentUser } = await serverAuth(req);

    if (req.method === "POST" || req.method === "DELETE") {
      const { movieId } = req.body;

      console.log("movieId in Favourite++++", movieId);

      // Validate movieId format before querying the database

      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        },
      });

      if (!existingMovie) {
        throw new Error("Movie not found or invalid ID");
      }

      let updatedFavoriteIds;
      if (req.method === "POST") {
        updatedFavoriteIds = [...currentUser.favouriteIds, movieId];
      } else if (req.method === "DELETE") {
        updatedFavoriteIds = without(currentUser.favouriteIds, movieId);
      }

      const updatedUser = await prismadb.user.update({
        where: {
          email: currentUser.email || "",
        },
        data: {
          favouriteIds: updatedFavoriteIds,
        },
      });

      return res.status(200).json(updatedUser);
    }

    return res.status(405).end("Method not allowed");
  } catch (error) {
    console.error("Handler Error:", error);
    return res.status(500).end("Internal Server Error");
  }
}
