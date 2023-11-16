import axios from "axios";
import React, { useCallback, useMemo } from "react";
import { AiOutlineCheck, AiOutlinePlus } from "react-icons/ai";

import useFavorites from "@/hooks/useFavorites";
import useCurrentUser from "@/hooks/useCurrentUser";

interface FavoriteButtonProps {
  movieId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
  const { mutate: mutateFavorites } = useFavorites();

  const { data: currentUser, mutate } = useCurrentUser();

  console.log("currentUser for FVBTN", currentUser)

  const isFavorite = useMemo(() => {
    const list = currentUser?.favouriteIds || [];

    console.log("list", list)

    return list.includes(movieId);
  }, [currentUser, movieId]);

  console.log("isFavorite", isFavorite);

  // Inside toggleFavorites
  const toggleFavorites = useCallback(async () => {
    try {
      let response;

      if (isFavorite) {
        response = await axios.delete("/api/favorite", {
          data: {
            movieId,
          },
        });
      } else {
        response = await axios.post("/api/favorite", {
          movieId,
        });
      }

      const updatedFavorites = response?.data?.favoriteIds;

      if (updatedFavorites !== undefined) {
        mutate({
          ...currentUser,
          favouriteIds: updatedFavorites,
        });

        mutateFavorites();
      } else {
        console.error("Unexpected response data:", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [movieId, isFavorite, currentUser, mutate, mutateFavorites]);

  const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus;

  return (
    <div
      onClick={toggleFavorites}
      className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300"
    >
      <Icon className="text-white" size={23} />
    </div>
  );
};

export default FavoriteButton;
