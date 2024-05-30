// import React, { useEffect, useState } from "react";
// import {
//   GetMyProfileQuery,
//   MutationDeleteUserArgs,
//   MutationUpdateUserArgs,
// } from "@/gql/graphql";
// import { gql, useQuery, useMutation } from "@apollo/client";
// import { RxCross1 } from "react-icons/rx";
// import FavoriCard from "@/components/settings/FavoriCard";
// import SideBarSettings from "@/components/settings/SideBarSettings";
// import {
//   GET_MY_PROFILE_FAVORIES,
//   UPDATE_MY_PROFILE,
//   DELETE_ACCOUNT,
//   REMOVE_FAVORI,
// } from "@/gql/queries";
// import { useRouter } from "next/router";

// interface updateUserArgs {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   updateUserId: string;
// }
// interface favori {
//   id: string;
//   name: string;
//   description: string;
//   city: { name: string };
// }

// export default function settings() {
//   const [showInputs, setShowInputs] = useState<string>("");
//   const [inputType, setInputType] = useState<string>("text");
//   const { data, loading, refetch } = useQuery<GetMyProfileQuery>(
//     GET_MY_PROFILE_FAVORIES,
//   );
//   const [passwordValueInput, setPasswordValueInput] = useState<string>(
//     "Modifier mon mot de passe",
//   );
//   const [confirmPasswordValueInput, setConfirmPasswordValueInput] =
//     useState<string>("Confirmer le mot de passe");
//   const [activeItemSideBarSettings, setActiveItemSideBarSettings] =
//     useState("Profil");
//   const [favories, setFavories] = useState<favori[]>([]);

//   let dataProfile: updateUserArgs = {
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     updateUserId: "",
//   };

//   if (data) {
//     dataProfile = {
//       firstName: data.myProfile.firstName,
//       lastName: data.myProfile.lastName,
//       email: data.myProfile.email,
//       password: data.myProfile.hashedPassword,
//       updateUserId: data.myProfile.id,
//     };
//   }

//   const [formData, setFormData] = useState<updateUserArgs>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     updateUserId: "",
//   });

//   useEffect(() => {
//     if (dataProfile) {
//       setFormData(dataProfile);
//       setFavories(data?.myProfile.favoritesPlaces as favori[]);
//     }
//   }, [data]);
//   const updateFormData = (partialFormData: Partial<MutationUpdateUserArgs>) => {
//     setFormData({ ...formData, ...partialFormData });
//   };

//   const router = useRouter();
//   const [UpdateUserMutation, { error: updateUserError }] =
//     useMutation<MutationUpdateUserArgs>(UPDATE_MY_PROFILE);

//   const [DeleteAccount, { error: deleteAccount }] =
//     useMutation<MutationDeleteUserArgs>(DELETE_ACCOUNT);

//   const UpdateProfileData = async (updatedData: updateUserArgs) => {
//     try {
//       const { data } = await UpdateUserMutation({
//         variables: formData,
//       });
//       setShowInputs("");
//     } catch (error) {} // GÉRER ERREUR
//   };

//   useEffect(() => {}, [formData]);

//   const [RemoveFavori, { error: removeFavoriError }] = useMutation(
//     REMOVE_FAVORI,
//     {
//       update(cache, { data: { removeFavoritePlace } }) {
//         const { myProfile }: any = cache.readQuery({
//           query: GET_MY_PROFILE_FAVORIES,
//         });
//         const updatedFavorites = myProfile.favoritesPlaces.filter(
//           (favorite: any) => favorite.id !== removeFavoritePlace.id,
//         );
//         cache.writeQuery({
//           query: GET_MY_PROFILE_FAVORIES,
//           data: {
//             myProfile: {
//               ...myProfile,
//               favoritesPlaces: updatedFavorites,
//             },
//           },
//         });
//       },
//     },
//   );

//   const RemoveFavoriPlace = async (idPlace: string) => {
//     console.log(idPlace);
//     try {
//       const { data } = await RemoveFavori({
//         variables: {
//           placeId: idPlace,
//         },
//       });
//       await refetch();
//     } catch (error) {} // GÉRER ERREUR
//   };

//   const DeleteAccountUser = async () => {
//     console.log("Je passe ici");
//     const userId = data?.myProfile.id;
//     if (data?.myProfile.id) {
//       try {
//         const { data } = await DeleteAccount({
//           variables: {
//             deleteUserId: userId,
//           },
//         });
//         router.push("/home");
//       } catch (error) {
//         console.log(error);
//       } // GÉRER ERREUR
//     }
//   };

//   return (
//     <div>
//       <div>
//         <SideBarSettings
//           setActiveItemSideBarSettings={setActiveItemSideBarSettings}
//           firstnameProfile={dataProfile.firstName}
//         />
//         <div>
//           {activeItemSideBarSettings == "Profil" && (
//             <div className="flex justify-center items-center flex-col mt-6">
//               <div>
//                 <form
//                   className="bg-form_color p-8 rounded-lg shadow-lg shadow-gray-300 min-w-full flex flex-col"
//                   onSubmit={(event) => {
//                     UpdateProfileData(formData);
//                     event.preventDefault();
//                   }}
//                   aria-label="form"
//                 >
//                   <h1 className="font-medium text-2xl text-gray-600 text-center mb-4">
//                     Modifier mes informations
//                   </h1>
//                   <div>
//                     <label className="text-gray-600 text-sm">Nom</label>
//                     <div className="flex">
//                       {" "}
//                       <input
//                         className="w-full p-1 bg-white-200 rounded-lg mb-2 border focus:border-blue-500 focus:outline-none text-gray-500"
//                         name="lastname"
//                         id="lastname"
//                         value={formData.lastName || ""}
//                         onChange={(event) => {
//                           updateFormData({ lastName: event.target.value });
//                         }}
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="text-gray-600 text-sm">Prénom</label>
//                     <div className="flex">
//                       {" "}
//                       <input
//                         className="w-full p-1 bg-white-200 rounded-lg mb-2 border focus:border-blue-500 focus:outline-none text-gray-500"
//                         type="text"
//                         name="firstname"
//                         id="firstname"
//                         value={formData.firstName || ""}
//                         onChange={(event) => {
//                           updateFormData({
//                             firstName: event.target.value,
//                           });
//                         }}
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="text-gray-600 text-sm">Email</label>
//                     <div className="flex">
//                       {" "}
//                       <input
//                         className="w-full p-1 bg-white-200 rounded-lg mb-2 border focus:border-blue-500 focus:outline-none text-gray-500"
//                         type="text"
//                         name="email"
//                         id="email"
//                         value={formData.email || ""}
//                         onChange={(event) => {
//                           updateFormData({ email: event.target.value });
//                         }}
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="text-gray-600 text-sm">
//                       Mot de passe
//                     </label>
//                     <div className="flex">
//                       <input
//                         className="w-full p-1 bg-white-200 rounded-lg mb-2 border focus:border-blue-500 focus:outline-none text-gray-500"
//                         type={inputType}
//                         name="password"
//                         id="password"
//                         value={passwordValueInput || ""}
//                         minLength={12}
//                         onChange={(event) => {
//                           const value = event.target.value;
//                           updateFormData({ password: event.target.value });
//                           setInputType(value ? "password" : "text");
//                         }}
//                         onClick={() => setShowInputs("password")}
//                       />
//                     </div>
//                   </div>
//                   {showInputs == "password" && (
//                     <div className="flex flex-col">
//                       <div className="flex items-center">
//                         <input
//                           className="bg-white-200 w-full p-1 rounded-lg mr-2 border  focus:border-blue-500 focus:outline-none text-gray-500"
//                           type="password"
//                           name="confirm"
//                           id="confirm"
//                           minLength={12}
//                           value={confirmPasswordValueInput}
//                           pattern={formData.password}
//                           title="Les mots de passe ne correspondent pas"
//                           required
//                         />
//                         <button
//                           onClick={() => {
//                             setShowInputs("");
//                             updateFormData({
//                               password: formData.password,
//                             });
//                           }}
//                         >
//                           <RxCross1
//                             size={24}
//                             className="cursor-pointer"
//                             style={{ color: "black" }}
//                           />
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                   <button
//                     type="submit"
//                     className="bg-tertiary_color p-2 rounded-lg text-white w-36 self-center mt-4"
//                   >
//                     Enregistrer
//                   </button>
//                 </form>
//               </div>
//             </div>
//           )}
//           {activeItemSideBarSettings == "Settings" && (
//             <>
//               <div className="text-center ml-80 mr-80">
//                 <h1 className="font-medium text-xl text-gray-500 mt-8  text-center">
//                   Données et confidentialité
//                 </h1>
//                 <p className="font-medium mt-4 text-warmGray-700">
//                   EcoCityGuide s'engage pour le respect de vos données.
//                 </p>
//                 <p className="mt-2 text-warmGray-700 text-fontSizeText">
//                   Vos données personnelles sont confidentielles et ne sont
//                   jamais partagées avec des tiers privés ou partenaires
//                   professionnels.
//                 </p>
//                 <p className="mt-2 text-warmGray-700 text-fontSizeText">
//                   Vos données d'utilisation de l'application ne sont jamais
//                   partagées ni à des tiers privés ni à des professionnels.
//                 </p>
//                 <p className="mt-2 text-warmGray-700 text-fontSizeText">
//                   Ces données sont seulement utilisées à des fins statistiques
//                   pour le propriétaire de l'application.
//                 </p>
//               </div>

//               <div className="text-center ml-80 mr-80">
//                 <h1 className="font-medium text-xl text-gray-500 mt-16 text-center">
//                   Supprimer mon compte
//                 </h1>
//                 <p className="font-medium mt-4 text-warmGray-700">
//                   Attention, la suppression de votre compte est définitive.
//                 </p>
//                 <p className="mt-2 text-warmGray-700 text-fontSizeText">
//                   Toutes les données personnelles et relatives à la gestion de
//                   votre application seront définitivement supprimées.
//                 </p>
//                 <p className="mt-2 text-warmGray-700">
//                   Les commentaires que vous avez écris seront anonymisés mais
//                   toujours visibles sur EcoCityGuide.
//                 </p>
//                 <button
//                   className=" bg-red-600 text-white py-2 w-36 rounded-lg px-2 mt-4"
//                   onClick={() => DeleteAccountUser()}
//                 >
//                   {" "}
//                   Supprimer
//                 </button>
//               </div>
//             </>
//           )}
//           {activeItemSideBarSettings == "Favoris" && (
//             <>
//               <h2 className="font-medium text-xl text-gray-500 mt-8  text-center">
//                 Mes Favoris
//               </h2>
//               <div className="flex justify-center">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 mt-2">
//                   {favories && favories.length > 0 ? (
//                     favories.map((favori, index) => (
//                       <div key={index} className="flex justify-center mt-4">
//                         <FavoriCard
//                           name={favori.name}
//                           description={favori.description}
//                           city={favori.city.name}
//                           idPlace={favori.id}
//                           RemoveFavori={() => RemoveFavoriPlace(favori.id)}
//                         />
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-center">
//                       Vous n'avez pas encore de favoris
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  GetMyProfileQuery,
  MutationDeleteUserArgs,
  MutationUpdateUserArgs,
} from "@/gql/graphql";
import { gql, useQuery, useMutation } from "@apollo/client";
import { RxCross1 } from "react-icons/rx";
import FavoriCard from "@/components/settings/FavoriCard";
import SideBarSettings from "@/components/settings/SideBarSettings";
import {
  GET_MY_PROFILE_FAVORIES,
  UPDATE_MY_PROFILE,
  DELETE_ACCOUNT,
  REMOVE_FAVORI,
} from "@/gql/queries";
import { useRouter } from "next/router";

interface updateUserArgs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  updateUserId: string;
}
interface favori {
  id: string;
  name: string;
  description: string;
  city: { name: string };
}

export default function Settings() {
  const [showInputs, setShowInputs] = useState<string>("");
  const { data, loading, refetch } = useQuery<GetMyProfileQuery>(
    GET_MY_PROFILE_FAVORIES,
  );
  const [passwordValueInput, setPasswordValueInput] = useState<string>(
    "Modifier mon mot de passe",
  );
  const [confirmPasswordValueInput, setConfirmPasswordValueInput] =
    useState<string>("Confirmer le mot de passe");
  const [activeItemSideBarSettings, setActiveItemSideBarSettings] =
    useState("Profil");
  const [favories, setFavories] = useState<favori[]>([]);
  const [inputType, setInputType] = useState<string>("text");
  const [confirmPasswordType, setConfirmPasswordType] =
    useState<string>("text");
  const [showCancelButton, setShowCancelButton] = useState(false);

  let dataProfile: updateUserArgs = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    updateUserId: "",
  };

  if (data) {
    dataProfile = {
      firstName: data.myProfile.firstName,
      lastName: data.myProfile.lastName,
      email: data.myProfile.email,
      password: data.myProfile.hashedPassword,
      updateUserId: data.myProfile.id,
    };
  }

  const [formData, setFormData] = useState<updateUserArgs>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    updateUserId: "",
  });

  useEffect(() => {
    if (dataProfile) {
      setFormData(dataProfile);
      setFavories(data?.myProfile.favoritesPlaces as favori[]);
    }
  }, [data]);

  const updateFormData = (partialFormData: Partial<MutationUpdateUserArgs>) => {
    setFormData({ ...formData, ...partialFormData });
  };

  const router = useRouter();
  const [UpdateUserMutation, { error: updateUserError }] =
    useMutation<MutationUpdateUserArgs>(UPDATE_MY_PROFILE);

  const [DeleteAccount, { error: deleteAccount }] =
    useMutation<MutationDeleteUserArgs>(DELETE_ACCOUNT);

  const UpdateProfileData = async (updatedData: updateUserArgs) => {
    try {
      const { data } = await UpdateUserMutation({
        variables: formData,
      });
      setShowInputs("");
      setConfirmPasswordValueInput("Confirmer le mot de passe");
      setPasswordValueInput("Modifier mon mot de passe");
      setInputType("text");
      setConfirmPasswordType("text");
    } catch (error) {
      // Gérer l'erreur
    }
  };

  const resetForm = () => {
    setFormData(dataProfile);
    setPasswordValueInput("Modifier mon mot de passe");
    setConfirmPasswordValueInput("Confirmer le mot de passe");
    setInputType("text");
    setConfirmPasswordType("text");
    setShowInputs("");
  };

  useEffect(() => {}, [formData]);

  const [RemoveFavori, { error: removeFavoriError }] = useMutation(
    REMOVE_FAVORI,
    {
      update(cache, { data: { removeFavoritePlace } }) {
        const { myProfile }: any = cache.readQuery({
          query: GET_MY_PROFILE_FAVORIES,
        });
        const updatedFavorites = myProfile.favoritesPlaces.filter(
          (favorite: any) => favorite.id !== removeFavoritePlace.id,
        );
        cache.writeQuery({
          query: GET_MY_PROFILE_FAVORIES,
          data: {
            myProfile: {
              ...myProfile,
              favoritesPlaces: updatedFavorites,
            },
          },
        });
      },
    },
  );

  const RemoveFavoriPlace = async (idPlace: string) => {
    console.log(idPlace);
    try {
      const { data } = await RemoveFavori({
        variables: {
          placeId: idPlace,
        },
      });
      await refetch();
    } catch (error) {
      // Gérer l'erreur
    }
  };

  const DeleteAccountUser = async () => {
    console.log("Je passe ici");
    const userId = data?.myProfile.id;
    if (data?.myProfile.id) {
      try {
        const { data } = await DeleteAccount({
          variables: {
            deleteUserId: userId,
          },
        });
        router.push("/home");
      } catch (error) {
        console.log(error);
      } // Gérer l'erreur
    }
  };

  return (
    <div>
      <div>
        <SideBarSettings
          setActiveItemSideBarSettings={setActiveItemSideBarSettings}
          firstnameProfile={dataProfile.firstName}
        />
        <div>
          {activeItemSideBarSettings == "Profil" && (
            <div className="flex justify-center items-center flex-col mt-6">
              <div>
                <form
                  className="bg-form_color p-8 rounded-lg shadow-lg shadow-gray-300 min-w-full flex flex-col"
                  onSubmit={(event) => {
                    UpdateProfileData(formData);
                    event.preventDefault();
                  }}
                  aria-label="form"
                >
                  <h1 className="font-medium text-2xl text-gray-600 text-center mb-4">
                    Modifier mes informations
                  </h1>
                  <div>
                    <label className="text-gray-600 text-sm">Nom</label>
                    <div className="flex">
                      {" "}
                      <input
                        className="w-full p-1 bg-white-200 rounded-lg mb-2 border focus:border-blue-500 focus:outline-none text-gray-500"
                        name="lastname"
                        id="lastname"
                        value={formData.lastName || ""}
                        onChange={(event) => {
                          updateFormData({ lastName: event.target.value });
                          setShowCancelButton(true);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm">Prénom</label>
                    <div className="flex">
                      {" "}
                      <input
                        className="w-full p-1 bg-white-200 rounded-lg mb-2 border focus:border-blue-500 focus:outline-none text-gray-500"
                        type="text"
                        name="firstname"
                        id="firstname"
                        value={formData.firstName || ""}
                        onChange={(event) => {
                          updateFormData({
                            firstName: event.target.value,
                          });
                          setShowCancelButton(true);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm">Email</label>
                    <div className="flex">
                      {" "}
                      <input
                        className="w-full p-1 bg-white-200 rounded-lg mb-2 border focus:border-blue-500 focus:outline-none textgray-500"
                        type="text"
                        name="email"
                        id="email"
                        value={formData.email || ""}
                        onChange={(event) => {
                          updateFormData({ email: event.target.value });
                          setShowCancelButton(true);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm">
                      Mot de passe
                    </label>
                    <div className="flex">
                      <input
                        className="w-full p-1 bg-white-200 rounded-lg mb-2 border focus:border-blue-500 focus:outline-none text-gray-500"
                        type={inputType}
                        name="password"
                        id="password"
                        value={passwordValueInput || ""}
                        placeholder="Modifier mon mot de passe"
                        minLength={12}
                        onChange={(event) => {
                          setShowCancelButton(true);
                          const value = event.target.value;
                          updateFormData({ password: value });
                          setPasswordValueInput(value);
                          setInputType(value ? "password" : "text");
                          if (value) setShowInputs("password");
                        }}
                        onClick={() => {
                          if (
                            passwordValueInput === "Modifier mon mot de passe"
                          ) {
                            setPasswordValueInput("");
                            setInputType("password");
                          }
                        }}
                      />
                    </div>
                  </div>
                  {showInputs == "password" && (
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <input
                          className="w-full p-1 bg-white-200 rounded-lg mb-2 border focus:border-blue-500 focus:outline-none text-gray-500"
                          type="password"
                          name="confirm"
                          id="confirm"
                          minLength={12}
                          placeholder="Confirmer le mot de passe"
                          pattern={formData.password}
                          title="Les mots de passe ne correspondent pas"
                          required
                        />
                      </div>
                    </div>
                  )}
                  <div
                    className={`flex ${showCancelButton ? "justify-between" : "justify-center"}`}
                  >
                    <button
                      className="bg-tertiary_color p-2 rounded-lg text-white w-36 self-center mt-4"
                      type="submit"
                    >
                      Enregistrer
                    </button>
                    {showCancelButton && (
                      <button
                        className="bg-red-500 text-white p-2 h-10 rounded-lg mt-4"
                        onClick={() => {
                          setShowCancelButton(false);
                          resetForm;
                        }}
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
          {activeItemSideBarSettings === "Settings" && (
            <>
              <div className="text-center ml-80 mr-80">
                <h1 className="font-medium text-xl text-gray-500 mt-8 text-center">
                  Données et confidentialité
                </h1>
                <p className="font-medium mt-4 text-warmGray-700">
                  EcoCityGuide s'engage pour le respect de vos données.
                </p>
                <p className="mt-2 text-warmGray-700 text-fontSizeText">
                  Vos données personnelles sont confidentielles et ne sont
                  jamais partagées avec des tiers privés ou partenaires
                  professionnels.
                </p>
                <p className="mt-2 text-warmGray-700 text-fontSizeText">
                  Vos données d'utilisation de l'application ne sont jamais
                  partagées ni à des tiers privés ni à des professionnels.
                </p>
                <p className="mt-2 text-warmGray-700 text-fontSizeText">
                  Ces données sont seulement utilisées à des fins statistiques
                  pour le propriétaire de l'application.
                </p>
              </div>
              <div className="text-center ml-80 mr-80">
                <h1 className="font-medium text-xl text-gray-500 mt-16 text-center">
                  Supprimer mon compte
                </h1>
                <p className="font-medium mt-4 text-warmGray-700">
                  Attention, la suppression de votre compte est définitive.
                </p>
                <p className="mt-2 text-warmGray-700 text-fontSizeText">
                  Toutes les données personnelles et relatives à la gestion de
                  votre application seront définitivement supprimées.
                </p>
                <p className="mt-2 text-warmGray-700">
                  Les commentaires que vous avez écrits seront anonymisés mais
                  toujours visibles sur EcoCityGuide.
                </p>
                <button
                  className="bg-red-600 text-white py-2 w-36 rounded-lg px-2 mt-4"
                  onClick={DeleteAccountUser}
                >
                  Supprimer
                </button>
              </div>
            </>
          )}
          {activeItemSideBarSettings === "Favoris" && (
            <>
              <h2 className="font-medium text-xl text-gray-500 mt-8 text-center">
                Mes Favoris
              </h2>
              <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 mt-2">
                  {favories && favories.length > 0 ? (
                    favories.map((favori, index) => (
                      <div key={index} className="flex justify-center mt-4">
                        <FavoriCard
                          name={favori.name}
                          description={favori.description}
                          city={favori.city.name}
                          idPlace={favori.id}
                          RemoveFavori={() => RemoveFavoriPlace(favori.id)}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-center">
                      Vous n'avez pas encore de favoris
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
