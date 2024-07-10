import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import UserModal from "../modals/UserModal";
import { GET_PROFILE } from "@/gql/queries";
import { useRouter } from "next/router";
import { SIGN_OUT } from "@/gql/mutations";
import { AiOutlineLogin } from "react-icons/ai";
import { toast } from "react-toastify";

export default function Initials() {
  const { data, loading } = useQuery(GET_PROFILE);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const [signOutMutation] = useMutation(SIGN_OUT);

  const signOut = async () => {
    try {
      const { data } = await signOutMutation();
      if (data && data.signOut) {
        toast.success("Vous êtes bien déconnecté(e) !");
        router.push("/home");
        location.reload();
      }
    } catch (error) {}
  };

  function toggleModal() {
    return setIsModalOpen(!isModalOpen);
  }

  const signIn = () => {
    router.push("/login/sign-in");
  };

  return (
    <>
      {!loading &&
        (data?.myProfile ? (
          <>
            <button
              onClick={toggleModal}
              className="w-11 h-11 text-xl bg-tertiary_color transition-all duration-300 hover:bg-primary_color rounded-full text-fontSizeModale shadow-lg shadow-gray-400 text-primary_color hover:text-tertiary_color tracking-wide font-semibold font-sans"
            >
              {data.myProfile.userInitials}
            </button>
            {isModalOpen && (
              <UserModal onClose={toggleModal}>
                <div className="fixed block px-4 py-2 bg-primary_color border-2 text-fontSizeModale border-secondary_color top-20 right-32 border-opacity-30 rounded-lg text-center text-secondary_color animate-fade">
                  <p className="p-2 hover:text-tertiary_color">
                    <a href="/settings">Mon compte</a>
                  </p>
                  <p
                    className="p-2 hover:text-tertiary_color"
                    onClick={() => {
                      signOut();
                    }}
                  >
                    <a href="/">Se déconnecter</a>
                  </p>
                </div>
              </UserModal>
            )}
          </>
        ) : (
          <button
            onClick={signIn}
            className="flex justify-center items-center min-w-11 min-h-11 lg:px-4 lg:py-1 bg-tertiary_color border-2 text-fontSizeModale border-primary_color rounded-full tracking-wide font-semibold font-sans text-primary_color transition-all duration-300 hover:text-tertiary_color hover:bg-primary_color"
          >
            <AiOutlineLogin size={20} />
            <p className="ml-2 hidden lg:block">Se connecter</p>
          </button>
        ))}
    </>
  );
}
