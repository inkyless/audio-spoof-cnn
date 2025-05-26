import { defaultSystem } from "@chakra-ui/react"
import Header from "../Header";
import Footer from "../Footer";
import { ChakraProvider, Box, Flex } from "@chakra-ui/react";
import Feedback from "../resultpage/feedback";
import FullDisplay from "../resultpage/resultDisplay";

const ResultPage = () => {
       return(
<ChakraProvider value={defaultSystem}>
      <Flex direction="column" minH="100vh">
        <Box as="header" data-state="open"
          _open={{
            animation: "fade-in 300ms ease-out",
          }}>
          <Header />
        </Box>
        <Box as="main" flex="1" >
          <FullDisplay />
          <Feedback />
        </Box>
        <Box as="footer">
          <Footer />
        </Box>
      </Flex>
    </ChakraProvider>
       ) 
}

export default ResultPage;