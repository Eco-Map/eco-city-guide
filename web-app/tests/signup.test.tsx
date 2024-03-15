import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { MockedProvider } from "@apollo/client/testing";
import SignUpPage from "@/pages/login/sign-up";
import {
  mockWithData_GetMyProfile,
  mockWithData_SignUpForm,
  mockWithInvalidData_SignUpForm,
  mocksWithUndefinedData_GetMyProfile,
} from "./signup.dataset";

export const mockRouterPush = jest.fn();

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

describe("SignUp Page", () => {
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

  test("redirects to login page when user has created an account", async () => {
    render(
      <MockedProvider
        mocks={[...mocksWithUndefinedData_GetMyProfile, ...mockWithData_SignUpForm]}
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
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/login/sign-in");
    });
  });

  // Test pour la création d'un compte avec des données invalides
  test("does not redirect if some of the fields are not correctly completed", async () => {
    render(
      <MockedProvider
        mocks={[
          ...mocksWithUndefinedData_GetMyProfile,
          ...mockWithInvalidData_SignUpForm,
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

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(mockRouterPush).not.toHaveBeenCalledWith("/login/sign-in");
    });
  });
});
