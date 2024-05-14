import { gql, useQuery } from "@apollo/client";
import { GetMyProfileInitialsQuery } from "@/gql/graphql";
import { useState } from "react";
import { Modal } from "../modals/Modal.styled";
import UserModal from "../modals/UserModal";
import user from "../../../public/images/user.png";
import Image from "next/image";

const GET_MY_PROFILE_INITIALS = gql`
  query GetMyProfileInitials {
    myProfile {
      id
      firstName
      lastName
      initials
    }
  }
`;

export default function Initials() {
  const { data, loading } = useQuery<GetMyProfileInitialsQuery>(
    GET_MY_PROFILE_INITIALS,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  function toggleModal() {
    return setIsModalOpen(!isModalOpen);
  }

  return (
    <>
      {!loading && data?.myProfile ? (
        <button
          onClick={toggleModal}
          className="w-12 h-12 mt-8 ml-4 mr-24 bg-green-500 rounded-full px-1 py-1 text-lg border-2 border-gray-700 text-gray-700 tracking-wide font-semibold font-sans"
        >
          {data.myProfile.initials}
          {isModalOpen && (
            <UserModal onClose={toggleModal}>
              <div className="fixed block w-48 h-24 text-md border-2 border-gray-700 top-24 right-24 bg-white bg-opacity-90 rounded-lg text-center text-gray-700">
                <p className="p-2 hover:bg-gray-200">
                  <a href="/settings">Mon compte</a>
                </p>
                <p className="p-2">Se déconnecter</p>
              </div>
            </UserModal>
          )}
        </button>
      ) : (
        <button className="h-12 mt-3 ml-4 mr-24 bg-secondary_color rounded-full px-3 text-lg border-2 border-black button_text_color tracking-wide font-semibold font-sans">
          <a href="/login/sign-in">{"Se connecter"}</a>
        </button>
      )}
    </>
  );
}
