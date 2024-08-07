import { UpdateUserAsAdminMutation, User } from "@/gql/generate/graphql";
import { UPDATE_USER_AS_ADMIN } from "@/gql/requests/mutations";
import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { GrUpdate } from "react-icons/gr";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

enum UserRole {
  webAdministrator = "webAdministrator",
  cityAdministrator = "cityAdministrator",
  user = "user",
}

interface Props {
  user: User;
  setIsEditionPanelAdmin: (isEditionPanelAdmin: boolean) => void;
  refetch: () => void;
}

export default function EditUserForm({
  user,
  setIsEditionPanelAdmin,
  refetch,
}: Props) {
  const [updatedUser, setUpdatedUser] = useState({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    password: user.hashedPassword,
  });

  const [updateUserMutation, { error }] =
    useMutation<UpdateUserAsAdminMutation>(UPDATE_USER_AS_ADMIN);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { data } = await updateUserMutation({
        variables: updatedUser,
      });
      if (data) {
        setIsEditionPanelAdmin(false);
        toast.success("L'utilisateur a bien été modifié !");
        refetch();
      }
    } catch (error) {}
  };

  return (
    <div className="flex flex-col animate-fade items-center w-80">
      <button
        onClick={() => setIsEditionPanelAdmin(false)}
        className="self-start text-2xl text-gray-500 rounded-xl transition-all duration-300 hover:bg-gray-100 hover:text-tertiary_color p-2 m-1 z-20"
      >
        <MdClose />
      </button>
      <div className="w-full">
        <div className="border-b border-gray-200">
          <p className="text-center text-2xl text-dark_text_color font-bold font-sans cursor-default mb-2">
            Modifier utilisateur
          </p>
        </div>
        <form className="pt-10 px-8">
          <label>Prénom</label>
          <input
            className="w-full bg-white-200 px-4 py-2 rounded-3xl transition-all duration-300 outline-none  hover:border-white hover:bg-input_hover_bg focus:outline-none mb-2 border border-tertiary_color"
            type="text"
            name="name"
            id="name"
            required
            value={updatedUser.firstName || ""}
            onChange={(event) => {
              setUpdatedUser({
                ...updatedUser,
                firstName: event.target.value,
              });
            }}
          />
          <label>Nom</label>
          <input
            className="w-full bg-white-200 px-4 py-2 rounded-3xl transition-all duration-300 outline-none  hover:border-white hover:bg-input_hover_bg focus:outline-none mb-2 border border-tertiary_color"
            type="text"
            name="name"
            id="name"
            required
            value={updatedUser.lastName || ""}
            onChange={(event) => {
              setUpdatedUser({
                ...updatedUser,
                lastName: event.target.value,
              });
            }}
          />
          <label>Email</label>
          <input
            className="w-full bg-white-200 px-4 py-2 rounded-3xl transition-all duration-300 outline-none  hover:border-white hover:bg-input_hover_bg focus:outline-none mb-2 border border-tertiary_color"
            type="email"
            name="name"
            id="name"
            required
            value={updatedUser.email || ""}
            onChange={(event) => {
              setUpdatedUser({
                ...updatedUser,
                email: event.target.value,
              });
            }}
          />
          <div className="flex flex-col">
            <label htmlFor="role">Rôle</label>
            <select
              className="px-4 py-2 cursor-pointer rounded-3xl transition-all duration-300 outline-none  focus:outline-none hover:border-white hover:bg-input_hover_bg mb-2 border border-tertiary_color"
              name="role"
              id="role"
              value={updatedUser.role}
              onChange={(event) => {
                setUpdatedUser({ ...updatedUser, role: event.target.value });
              }}
            >
              <option className="cursor-pointer" value={UserRole.user}>
                Utilisateur
              </option>
              <option
                className="cursor-pointer"
                value={UserRole.cityAdministrator}
              >
                Administrateur de ville
              </option>
              <option
                className="cursor-pointer"
                value={UserRole.webAdministrator}
              >
                Administrateur du site
              </option>
            </select>
          </div>
          {error && (
            <div className="w-full mt-4 text-md text-red-600 text-center">
              {error.message}
            </div>
          )}
          <button
            type="button"
            onClick={(event) => {
              handleFormSubmit(event);
            }}
            className="flex items-center justify-center text-center w-full mt-6 mb-4 border bg-tertiary_color rounded-3xl px-4 py-2 text-white tracking-wide font-semibold font-sans transition-all duration-300 hover:bg-white hover:text-tertiary_color hover:border hover:border-tertiary_color"
          >
            <GrUpdate className="text-xl" />
            <p className="ms-4 text-lg">Valider</p>
          </button>
        </form>
      </div>
    </div>
  );
}
