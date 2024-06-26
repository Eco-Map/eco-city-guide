import Layout from "@/components/Layout";
import type { AppProps } from "next/app";
import "@/styles/output.css";
import "@/styles/leaflet-style.css";
import { ApolloProvider } from "@apollo/client";
import createApolloClient from "../apollo-client";
import "leaflet/dist/leaflet.css";
import PlaceContext from "@/contexts/PlaceContext";
import { useState } from "react";
import { Place } from "@/gql/graphql";

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = createApolloClient();
  const [place, setPlace] = useState<Place | undefined>(undefined);

  return (
    <PlaceContext.Provider value={{ place, setPlace }}>
      <ApolloProvider client={apolloClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </PlaceContext.Provider>
  );
}
