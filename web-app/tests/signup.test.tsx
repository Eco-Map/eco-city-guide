import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { GET_MY_PROFILE_SIGN_IN } from "@/pages/login/sign-in";
import SignUpPage, { SIGN_UP_FORM } from "@/pages/login/sign-up";

const mockRouterPush = jest.fn();

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

// simuler un utilisateur connecté
const mockWithData_GetMyProfile: MockedResponse[] = [
  {
    request: {
      query: GET_MY_PROFILE_SIGN_IN,
    },
    result: {
      data: {
        myProfile: {
          id: "ffba84fc-2d80-4633-bbaf-bfd2a6ee6b37",
          email: "aaa@aaa.com",
          firstName: "aaa",
          lastName: "aaa",
        },
      },
    },
  },
];

//Simuler l'enregistrement d'un utilisateur en base de données
const mockWithData_SignUpForm = [
  {
    request: {
      query: SIGN_UP_FORM,
      variables: {
        firstName: "aaa",
        lastName: "aaa",
        email: "aaa@aaa.com",
        password: "aaaaaaaaaaaa",
      },
    },
    result: {
      data: {
        signUp: {
          id: "ffba84fc-2d80-4633-bbaf-bfd2a6ee6b37",
          email: "aaa@aaa.com",
          firstName: "aaa",
          lastName: "aaa",
          password: "aaaaaaaaaaaa",
        },
      },
    },
  },
];

//mock pour la création de compte utilisateur avec des champs invalides
const mockWithInvalidData_SignUpForm = [
  {
    request: {
      query: SIGN_UP_FORM,
      variables: {
        firstName: "1",
        lastName: "2",
        email: "axhje",
        password: "aaaa",
      },
    },
    result: {
      data: {
        signUp: {
          id: "",
          email: "",
          firstName: "",
          lastName: "",
        },
      },
    },
  },
];

describe("SignUp Page", () => {
  //Test si un utilisateur est déjà connecté
  test("redirects to home page if user is already signed in", async () => {
    render(
      <MockedProvider mocks={mockWithData_GetMyProfile} addTypename={false}>
        <SignUpPage />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/home");
    });
  });

  //Test pour la création de compte par un nouvel utilisateur
  test("redirects to login page when user has created an account", async () => {
    render(
      <MockedProvider
        mocks={[...mockWithData_SignUpForm, ...mockWithData_GetMyProfile]}
        addTypename={false}
      >
        <SignUpPage />
      </MockedProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Prénom/i), {
      target: { value: "aaa" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Nom de famille/i), {
      target: { value: "aaa" },
    });
    fireEvent.change(screen.getByPlaceholderText(/@email/i), {
      target: { value: "aaa@aaa.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), {
      target: { value: "aaaaaaaaaaaa" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirmer/i), {
      target: { value: "aaaaaaaaaaaa" },
    });
    fireEvent.click(screen.getByRole("button", { name: /S'inscrire/i }));

    await waitFor(() => {
      expect(mockRouterPush).not.toHaveBeenCalledWith("/login/sign-in");
    });
  });

  // Test pour la création d'un compte avec des données invalides
  test("informs the user that some of the fields are not correctly completed", async () => {
    render(
      <MockedProvider
        mocks={[
          ...mockWithInvalidData_SignUpForm,
          ...mockWithData_GetMyProfile,
        ]}
        addTypename={false}
      >
        <SignUpPage />
      </MockedProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Prénom/i), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Nom de famille/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByPlaceholderText(/@email/i), {
      target: { value: "axhje" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), {
      target: { value: "aaaa" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirmer/i), {
      target: { value: "aaaa" },
    });

    fireEvent.click(screen.getByRole("button", { name: /S'inscrire/i }));

    await waitFor(() => {
      expect(mockRouterPush).not.toHaveBeenCalledWith("/login/sign-in");
    });
  });
});
