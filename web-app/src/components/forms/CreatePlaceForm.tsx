import PlaceContext, { PlaceContextType } from "@/contexts/PlaceContext";
import { Category, MutationCreatePlaceArgs, Place } from "@/gql/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AddressInterface } from "@/interfaces/Address";
import { GET_CATEGORIES } from "@/gql/queries";
import { CREATE_PLACE } from "@/gql/mutations";
import axios from "axios";
import DisplayPanelContext, {
  DisplayPanelType,
} from "@/contexts/DisplayPanelContext";
import { SideBarContentEnum } from "../home/sideBarContent.type";
import { MdClose } from "react-icons/md";

export default function CreatePlaceForm() {
  const [searchAddress, setSearchAddress] = useState("");
  const [city, setCity] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [formData, setFormData] = useState<MutationCreatePlaceArgs>({
    name: "",
    description: "",
    coordinates: [2.284784, 48.885665],
    address: "",
    city: "",
    categoryIds: [],
  });
  const { place, setPlace } = useContext(PlaceContext) as PlaceContextType;
  const { setSideBarEnum } = useContext(
    DisplayPanelContext,
  ) as DisplayPanelType;

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchAddress(event?.target.value);
    if (searchAddress.length > 3) {
      axios
        .get("https://api-adresse.data.gouv.fr/search", {
          params: {
            q: `${searchAddress}`,
          },
        })
        .then((response) => {
          setAddressList(response.data.features);
        })
        .catch((error) => {
          throw new Error("Error fetching data: " + error);
        });
    }
  };

  const handleCloseButton = () => {
    setSideBarEnum(SideBarContentEnum.NO_CONTENT);
  };

  const [createPlaceMutation] =
    useMutation<MutationCreatePlaceArgs>(CREATE_PLACE);

  const createPlace = async () => {
    // TODO: disable create place on the map
    const { data } = await createPlaceMutation({
      variables: formData,
    });
    setPlace({
      name: formData.name,
      description: formData.description,
      coordinates: {
        type: "Point",
        coordinates: [formData.coordinates[0], formData.coordinates[1]],
      },
      address: formData.address,
      city: formData.city,
      categories: formData.categoryIds,
    } as unknown as Place);
  };

  const updateFormData = (
    partialFormData: Partial<MutationCreatePlaceArgs>,
  ) => {
    setFormData({ ...formData, ...partialFormData });
  };

  const handleAddressAutoComplete = (address: AddressInterface) => {
    setSearchAddress(address.properties.name);
    setCity(address.properties.city);
    updateFormData({
      address: address.properties.name,
    });
    updateFormData({ city: address.properties.city });
  };

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const { data: categoriesData, loading, error } = useQuery(GET_CATEGORIES);

  useEffect(() => {
    updateFormData({
      categoryIds: selectedCategories.map((category) => category.id),
    });
  }, [selectedCategories]);

  return (
    <div className="flex flex-col animate-fade items-center w-80 h-screen overflow-y-scroll">
      <button
        onClick={handleCloseButton}
        className="self-start text-2xl text-gray-500 rounded-xl transition-all duration-300 hover:bg-gray-100 hover:text-tertiary_color p-2 m-1 z-20"
      >
        <MdClose />
      </button>
      <div className="w-full">
        <div className="border-b border-gray-200">
          <p className="text-center text-2xl text-dark_text_color font-bold font-sans cursor-default mb-2">
            Créer lieu
          </p>
        </div>
        <form
          className="pt-10 px-8"
          onSubmit={(event) => {
            event.preventDefault();
            createPlace();
          }}
        >
          <input
            className="w-full bg-white-200 px-4 py-2 rounded-3xl transition-all duration-300 outline-none  hover:border-white hover:bg-input_hover_bg focus:outline-none mb-2 border border-tertiary_color"
            type="text"
            name="name"
            id="name"
            placeholder="Nom"
            required
            onChange={(event) => {
              updateFormData({ name: event.target.value });
            }}
          />
          <div className="relative">
            <input
              className={`w-full bg-white-200 px-4 py-2 transition-all duration-300 outline-none  hover:border-white hover:bg-input_hover_bg ${
                addressList.length > 0 ? "rounded-t-3xl" : "rounded-3xl"
              } focus:outline-none mb-2 border border-tertiary_color`}
              type="text"
              name="address"
              id="address"
              placeholder="Adresse"
              required
              value={searchAddress}
              onChange={(event) => {
                handleSearchInput(event);
                updateFormData({ address: event.target.value });
              }}
              onBlur={() => {
                setTimeout(() => {
                  setAddressList([]);
                }, 200);
              }}
            />
            {addressList.length > 0 && (
              <div className="flex flex-col absolute z-20 top-10 w-full py-1 rounded-b-3xl border border-tertiary_color bg-white animate-fade">
                {addressList.map((address: AddressInterface, index) => (
                  <li
                    key={index}
                    className="list-none mx-2 px-2 py-2 overflow-hidden text-ellipsis white-space-nowrap rounded-2xl transition-all duration-300 hover:bg-input_hover_bg"
                  >
                    <button
                      onClick={() => {
                        handleAddressAutoComplete(address);
                        updateFormData({
                          address: address.properties.name,
                          city: address.properties.city,
                          coordinates: [
                            address.geometry.coordinates[1],
                            address.geometry.coordinates[0],
                          ],
                        });
                        setAddressList([]);
                      }}
                      className="overflow-hidden text-ellipsis white-space-nowrap"
                    >
                      <p className="truncate">{address?.properties.label}</p>
                    </button>
                  </li>
                ))}
              </div>
            )}
          </div>
          <input
            className="w-full bg-white-200 px-4 py-2 rounded-3xl transition-all duration-300 outline-none hover:border-white hover:bg-input_hover_bg focus:outline-none mb-2 border border-tertiary_color"
            type="text"
            name="city"
            id="city"
            placeholder="Ville"
            value={city}
            onChange={(event) => {
              setCity(event.target.value);
              updateFormData({ city: event.target.value });
            }}
            required
          />
          <textarea
            className="flex resize-none align-top w-full h-32 bg-white-200 px-4 py-2 rounded-2xl transition-all duration-300 outline-none  hover:border-white hover:bg-input_hover_bg focus:outline-none mb-2 border border-tertiary_color"
            name="description"
            id="description"
            placeholder="Description"
            spellCheck
            required
            onChange={(event) => {
              updateFormData({ description: event.target.value });
            }}
          />
          <p className="text-gray-400 m-2">Catégories</p>
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 rounded-2xl mb-2">
              {selectedCategories.map((category) => (
                <span
                  className="cursor-pointer text-white text-xs bg-tertiary_color py-1 px-2 rounded-lg m-01 transition-all duration-300 hover:bg-input_hover_bg"
                  key={category.id}
                  onClick={() => {
                    setSelectedCategories(
                      selectedCategories.filter(
                        (selectedCategory) =>
                          selectedCategory.id !== category.id,
                      ),
                    );
                  }}
                >
                  {category.name} X
                </span>
              ))}
            </div>
          )}
          <select
            name="categories"
            id="categories"
            multiple
            className="w-full bg-white-200 px-4 py-2 rounded-xl mb-2 border border-tertiary_color focus:outline-none"
          >
            {categoriesData &&
              categoriesData.categories.map(
                (category: Category) =>
                  !selectedCategories.some(
                    (selectedCategory) => selectedCategory.id === category.id,
                  ) && (
                    <option
                      className="text-text_color px-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-input_hover_bg"
                      onClick={() => {
                        setSelectedCategories(
                          selectedCategories.concat([category]),
                        );
                      }}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ),
              )}
          </select>
          <button
            type="submit"
            className="flex items-center justify-center text-center w-full mt-4 mb-8 border bg-tertiary_color rounded-3xl px-4 py-2 text-white tracking-wide font-semibold font-sans transition-all duration-300 hover:bg-white hover:text-tertiary_color hover:border hover:border-tertiary_color"
          >
            <IoMdAddCircleOutline className="text-xl" />
            <p className="ms-4 text-lg">Ajouter</p>
          </button>
        </form>
      </div>
    </div>
  );
}
