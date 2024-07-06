import { useState, useContext } from "react";
import { useRouter } from "next/router";
import PlaceContext from "@/contexts/PlaceContext";
import { PlaceContextType } from "@/contexts/PlaceContext";
import { Place } from "@/gql/graphql";

interface Props {
  favorite: Place;
  RemoveFavorite: (idPlace: string) => Promise<void>;
}

export default function FavoriteCard({ favorite, RemoveFavorite }: Props) {
  const [clickedFavorite, setClickedFavorite] = useState(false);
  const router = useRouter();

  const { place, setPlace } = useContext(PlaceContext) as PlaceContextType;

  const handleMapClick = (favorite: Place) => {
    setPlace(favorite);
    router.push("/home");
  };

  return (
    <div
      className={`bg-white rounded-lg border w-60 ${clickedFavorite ? "h-52" : "h-42"} flex flex-col justify-between`}
    >
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-center mb-2">
          <i
            className={favorite.categories[0].icon}
            style={{ fontSize: "13px", color: "#111827" }}
          ></i>
          <p className="ml-2 text-gray-600 text-xs uppercase font-medium tracking-wide">
            {favorite.city.name}
          </p>
        </div>
        <h1 className="font-medium text-base leading-tight text-gray-900 mt-1">
          {favorite.name}
        </h1>
        <div
          className={`text-gray-600 text-xs mt-2 cursor-pointer ${
            clickedFavorite ? "" : "truncate"
          }`}
          onClick={() => setClickedFavorite(!clickedFavorite)}
        >
          {favorite.description}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          aria-label="Voir le lieu sur la carte"
          className="bg-tertiary_color rounded p-2 font-medium text-white w-24 h-8 flex items-center justify-center"
          onClick={() => handleMapClick(favorite)}
        >
          <div className="flex items-center justify-center">
            <span className="mr-2 text-sm">Carte</span>
            <i
              className="fa-solid fa-location-dot"
              style={{ fontSize: "16px" }}
            ></i>
          </div>
        </button>
        <button
          aria-label="Retirer le lieu des favoris"
          className="bg-blue-500 rounded p-2 font-medium text-white w-24 h-8 flex items-center justify-center"
          onClick={() => RemoveFavorite(favorite.id)}
        >
          <span className="mr-2 text-sm">Retirer</span>
          <i className="fa-solid fa-trash" style={{ fontSize: "13px" }}></i>
        </button>
      </div>
    </div>
  );
}
