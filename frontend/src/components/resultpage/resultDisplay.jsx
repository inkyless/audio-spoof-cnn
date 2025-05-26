import { Box, Image, Text, Heading, VStack, Flex } from "@chakra-ui/react";

const ImageBox = () => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      w="100%"
      textAlign="center"
      padding={2}
      minW={'70%'}
    >
      <Image
        src="https://picsum.photos/200/300"
        alt="Placeholder"
        borderRadius="md"
        mx="auto"
        width={"100%"}  
        height={"auto"}
      maxH={`300px`}
      objectFit="cover"
      fallbackSrc="https://via.placeholder.com/200x300.png?text=Image+Not+Available"
      />
      <Text mt={2} fontSize={"sm"}>This is a placeholder image (converted).</Text>
    </Box>
  );
};

const PredictionBox = () => {
  return (
    <Box
      p={4}
      w="100%"
      textAlign="center"
      color={"gray.700"}
      minH={`350px`}
      alignItems={"center"} 
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      
    >
      <Heading size="3xl" mb={2} fontWeight={"bold"}>Detection Result</Heading>
      <Text fontSize="lg" color="teal.600" fontWeight={"700"}>Predicted :</Text>
      <Text mt={2}>Confidence Score : </Text>
    </Box>
  );
};

const FullDisplay = () => {
  return (
    <VStack align="center" p={0.5} w="100%" color={"gray.800"}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="center"
        align="stretch"
        gap={8}
        w="100%"
        maxW="800px"
      >
        <Box flex={1}>
          <ImageBox />
        </Box>
        <Box flex={1}>
          <PredictionBox />
        </Box>
      </Flex>
    </VStack>
  );
};

export default FullDisplay;
