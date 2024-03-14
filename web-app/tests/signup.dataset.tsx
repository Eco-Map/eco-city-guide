import { GET_MY_PROFILE_SIGN_IN } from "@/pages/login/sign-in";
import { SIGN_UP_FORM } from "@/pages/login/sign-up";
import { MockedResponse } from "@apollo/client/testing";

// simuler un utilisateur connecté
export const mockWithData_GetMyProfile: MockedResponse[] = [
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
export const mockWithData_SignUpForm = [
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
          firstName: "aaa",
          lastName: "aaa",
          email: "aaa@aaa.com",
          password: "aaaaaaaaaaaa",
        },
      },
    },
  },
];

//mock pour la création de compte utilisateur avec des champs invalides
export const mockWithInvalidData_SignUpForm = [
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
          id: "11111",
          firstName: "1",
          lastName: "2",
          email: "axhje",
          password: "aaaa",
        },
      },
    },
  },
];

export const mockWithoutData_GetMyProfile: MockedResponse[] = [
  {
    request: {
      query: GET_MY_PROFILE_SIGN_IN,
      variables: {},
    },
    error: new Error("erreur"),
  },
];
