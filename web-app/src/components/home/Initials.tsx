import {
  GetMyProfileInitialsQuery,
  SignOutMutation,
  SignOutMutationVariables,
} from "@/gql/graphql";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import UserModal from "../modals/UserModal";
import { GET_MY_PROFILE_INITIALS } from "@/gql/queries";

export const SIGN_OUT = gql`
  mutation SignOut {
    signOut {
      id
    }
  }
`;

export default function Initials() {
  const router = useRouter();

  const { data, loading } = useQuery<GetMyProfileInitialsQuery>(
    GET_MY_PROFILE_INITIALS,
  );

  const [signOutMutation, { error }] = useMutation<
    SignOutMutation,
    SignOutMutationVariables
  >(SIGN_OUT);

  const signOut = async () => {
    try {
      const { data } = await signOutMutation();
      console.log(data);
      if (data && data.signOut) {
        router.push("/login/sign-in");
      }
    } catch (error) {}
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  function toggleModal() {
    return setIsModalOpen(!isModalOpen);
  }
  return (
    <>
      {!loading && data?.myProfile ? (
        <button
          onClick={toggleModal}
          className="p-3 mt-5 ml-4 mr-28 bg-tertiary_color transition-all duration-300 hover:bg-primary_color rounded-full text-fontSizeModale shadow-lg shadow-secondary_color text-primary_color hover:text-tertiary_color tracking-wide font-semibold font-sans"
        >
          {data.myProfile.userInitials}
          {isModalOpen && (
            <UserModal onClose={toggleModal}>
              <div className="fixed block px-4 py-2 bg-primary_color border-2 text-fontSizeModale border-secondary_color top-20 right-40  border-opacity-30 rounded-lg text-center text-secondary_color">
                <p className="p-2 hover:text-tertiary_color">
                  <a href="/settings">Mon compte</a>
                </p>
                <p
                  className="p-2 hover:text-tertiary_color"
                  onClick={() => {
                    signOut();
                  }}
                >
                  Se déconnecter
                </p>
              </div>
            </UserModal>
          )}
        </button>
      ) : (
        <button className="px-4 py-2 mt-6 ml-4 mr-32 bg-tertiary_color border-2 text-fontSizeModale border-primary_color top-20 right-40 rounded-full tracking-wide font-semibold font-sans text-primary_color transition-all duration-300 hover:text-tertiary_color hover:bg-primary_color">
          <p>
            <a href="/login/sign-in">Se connecter</a>
          </p>
        </button>
      )}
    </>
  );
}
