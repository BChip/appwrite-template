import { AppProps } from "next/app";
import { ChakraProvider, IconProps, extendTheme } from "@chakra-ui/react";
import "../styles/globals.css";
import SidebarWithHeader from "../components/sidebarWithHeader";

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  colors: {
    brand: {
      100: "#f7fafc",
      // ...
      900: "#1a202c",
    },
  },
}

const theme = extendTheme({ config });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <SidebarWithHeader>
        <Component {...pageProps} />
      </SidebarWithHeader>
    </ChakraProvider>
  );
}

export default MyApp;