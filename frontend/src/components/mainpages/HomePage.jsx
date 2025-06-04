import { defaultSystem,ChakraProvider, Box, Flex, VStack } from "@chakra-ui/react";
import Header from "../Header";
import Footer from "../Footer";
import ModelSubmit from "../homepage/ModelSelect";
import AudioMethod from "../homepage/AudioMethod";
import React, { useState } from "react";

const HomePage = () => {
  const [selectedModel, setSelectedModel] = useState('cnn');

  return (
    <ChakraProvider value={defaultSystem}>
 <Flex direction="column" minH="100vh">
        {/* Header Section */}
        <Box as="header">
          <Header />
        </Box>

        {/* Main Content */}
        <Box as="main" flex="1">
          <VStack align="center" spacing={4}>
            <AudioMethod selectedModel={selectedModel}/>
            <Box w="100%" maxW="1000px">
                <ModelSubmit onModelChange={setSelectedModel} />
            </Box>
          </VStack>
        </Box>

        {/* Footer Section */}
        <Box as="footer">
          <Footer />
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default HomePage;
