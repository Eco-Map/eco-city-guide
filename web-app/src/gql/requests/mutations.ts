import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $role: String!
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      role: $role
    ) {
      id
      firstName
      lastName
      email
      role
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!, $icon: String!) {
    createCategory(name: $name, icon: $icon) {
      id
      name
      icon
    }
  }
`;

export const CREATE_PLACE = gql`
  mutation CreatePlace(
    $name: String!
    $description: String!
    $coordinates: Geometry!
    $address: String!
    $city: String!
    $categoryIds: [String!]!
  ) {
    createPlace(
      name: $name
      description: $description
      coordinates: $coordinates
      address: $address
      city: $city
      categoryIds: $categoryIds
    ) {
      id
      name
      description
      coordinates
      address
      city {
        name
      }
      categories {
        icon
        name
      }
    }
  }
`;

export const ADD_FAVORITE_PLACE = gql`
  mutation AddFavoritePlace($placeId: String!) {
    addFavoritePlace(placeId: $placeId) {
      favoritesPlaces {
        __typename
        id
        name
        address
        city {
          __typename
          id
          name
        }
      }
    }
  }
`;

export const REMOVE_FAVORITE_PLACE = gql`
  mutation RemoveFavoritePlace($placeId: String!) {
    removeFavoritePlace(placeId: $placeId) {
      favoritesPlaces {
        __typename
        id
        name
        address
        city {
          __typename
          id
          name
        }
      }
    }
  }
`;

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
      email
    }
  }
`;

export const SIGN_OUT = gql`
  mutation SignOut {
    signOut {
      id
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId) {
      id
    }
  }
`;

export const DELETE_PLACE = gql`
  mutation DeletePlace($id: ID!) {
    deletePlace(id: $id) {
      id
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;

export const UPDATE_MY_PROFILE = gql`
  mutation UpdateUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $updateUserId: ID!
  ) {
    updateUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      id: $updateUserId
    ) {
      id
      firstName
      lastName
      email
      hashedPassword
    }
  }
`;

export const SIGN_UP = gql`
  mutation SignUp(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    signUp(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const UPDATE_PLACE = gql`
  mutation UpdatePlace(
    $name: String!
    $description: String!
    $coordinates: Geometry!
    $address: String!
    $city: String!
    $id: ID!
  ) {
    updatePlace(
      name: $name
      description: $description
      coordinates: $coordinates
      address: $address
      city: $city
      id: $id
    ) {
      address
      categories {
        id
        icon
        name
      }
      name
      description
      id
      city {
        id
        name
        coordinates
      }
      coordinates
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($name: String!, $icon: String!, $id: ID!) {
    updateCategory(name: $name, icon: $icon, id: $id) {
      name
      icon
    }
  }
`;

export const UPDATE_USER = gql`
  mutation Mutation(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $id: ID!
  ) {
    updateUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      id: $id
    ) {
      id
      role
      lastName
      userInitials
      firstName
      email
    }
  }
`;
