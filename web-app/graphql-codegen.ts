import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000",
  documents: ["src/gql/requests/mutations.ts", "src/gql/requests/queries.ts"],
  generates: {
    "src/gql/generate/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
