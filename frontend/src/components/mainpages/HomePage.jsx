import { defaultSystem, VStack } from "@chakra-ui/react";
import Header from "../Header";
import Footer from "../Footer";

import { ChakraProvider, Box, Flex,Stack } from "@chakra-ui/react";
import AudioRecorder from "../homepage/RecordAudio";
import UploadDemo from "../homepage/UploadAudio";
import ModelSelect from "../homepage/ModelSelect";

const HomePage = () => {
  return (
    <ChakraProvider value={defaultSystem}>
      <Flex direction="column" minH="100vh">
        <Box as="header">
          <Header />
        </Box>
        <Box as="main" flex="1">
        <VStack align="center" spacing={4}>
            <Box w="100%" maxW="800px">
            <Flex
                alignItems="center"
                justify="center"
                direction={{ base: "column", md: "row" }}
                gap={6}
                w="100%"
            >
                <UploadDemo />
                <AudioRecorder />
            </Flex>
            </Box>

            <Box w="100%" maxW="1000px">
            <Flex
                align="center"
                justify="center"
                w="100%"
                h="auto"
                p={0}
                m={0}
            >
                <ModelSelect />
            </Flex>
            </Box>
        </VStack>
        </Box>
        <Box as="footer">
          <Footer />
        </Box>
      </Flex>
    </ChakraProvider>
  );
};


export default HomePage;
