import { MutationCreateCategoryArgs } from "@/gql/graphql";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";

const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) {
      id
      name
    }
  }
`;

export default function CreateCategoriesForm() {
  const [formData, setFormData] = useState<MutationCreateCategoryArgs>({
    name: "",
  });

  const [createCategoryMutation] =
    useMutation<MutationCreateCategoryArgs>(CREATE_CATEGORY);

  const createCategory = async () => {
    await createCategoryMutation({
      variables: formData,
    });
  };

  const updateFormData = (
    partialFormData: Partial<MutationCreateCategoryArgs>
  ) => {
    setFormData({ ...formData, ...partialFormData });
  };
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-full px-8"
        onSubmit={(event) => {
          event.preventDefault();
          createCategory();
        }}
      >
        <form className="pt-10">
          <h1 className="text-center text-2xl mb-6 text-gray-600 font-bold font-sans cursor-default">
            New category
          </h1>
          <input
            className="w-full bg-white-200 px-4 py-2 rounded-3xl focus:outline-none mb-2 border border-border_color"
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            required
            onChange={(event) => {
              updateFormData({ name: event.target.value });
            }}
          />
          <button
            type="submit"
            className="flex items-center justify-center text-center w-full mt-4 border bg-button_bg_color rounded-3xl px-4 py-2 text-white tracking-wide font-semibold font-sans transition-colors duration-200 hover:bg-white hover:text-border_color hover:border hover:border-border_color"
          >
            <IoMdAddCircleOutline className="text-xl" />
            <p className="ms-4 text-lg">Save category</p>
          </button>
        </form>
      </div>
    </div>
  );
}
