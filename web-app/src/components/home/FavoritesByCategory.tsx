import { Place } from "@/gql/graphql";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { REMOVE_FAVORITE_PLACE } from "@/gql/mutations";
import PlaceContent from "./PlaceContent";

export default function FavoritesByCategoryContent({
  favorites: initialFavorites,
  selectedCategory,
  onBack,
  refetchFavorites,
}: {
  favorites: Place[];
  selectedCategory: string | null;
  onBack: () => void;
  refetchFavorites: () => void;
}) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [selectedFavorite, setSelectedFavorite] = useState<Place | null>(null);
  const [removeFavoritePlaceMutation] = useMutation(REMOVE_FAVORITE_PLACE);

  const handleSelectedFavorite = (place: Place) => {
    setSelectedFavorite(place);
  };

  const handleRemoveFavorite = async (placeId: string) => {
    try {
      await removeFavoritePlaceMutation({
        variables: { placeId },
      });
      setFavorites(favorites.filter((favorite) => favorite.id !== placeId));
      refetchFavorites();
      // TODO Snackbar Success removing favorite place
    } catch (error) {
      // TODO Snackbar Error removing favorite place
    }
  };

  return (
    <div className="h-screen bg-white w-80 overflow-y-auto">
      <button
        onClick={onBack}
        className="flex items-center mx-auto hover:bg-gray-100 rounded-xl space-x-2 text-gray-500 hover:text-green-500 p-2 m-1"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
        <span>Retour aux favoris</span>
      </button>
      {selectedFavorite ? (
        <PlaceContent />
      ) : (
        <>
          <div className="flex flex-row justify-center items-start px-8 border-b border-gray-200">
            <p className="text-center text-2xl text-gray-600 font-bold font-sans cursor-default mb-2">
              {selectedCategory}
            </p>
            <span className="text-gray-500 ml-3">
              {favorites.length} {favorites.length > 1 ? "lieux" : "lieu"}
            </span>
          </div>
          <div className="mt-2 mb-2">
            {favorites.map((favorite, index) => (
              <div
                key={index}
                className="hover:bg-gray-100 p-3 mr-3 ml-3 my-2 rounded-xl cursor-pointer hover:text-green-500"
                onClick={() => handleSelectedFavorite(favorite)}
              >
                <div className="flex justify-between items-center">
                  <p className="text-md font-medium">{favorite.name}</p>
                  <button
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mb-1">
                  Ville : {favorite.city.name}
                </p>
                <p className="text-gray-600">Addresse : {favorite.address}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
