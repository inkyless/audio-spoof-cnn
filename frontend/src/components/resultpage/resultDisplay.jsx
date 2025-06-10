import { Box, Image, Text, Heading, VStack, Flex } from "@chakra-ui/react";

const ImageBox = ({imageUrl}) => {
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
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
    >
      <Image
        src={imageUrl}
        alt="Converted Image"
        borderRadius="md"
        mx="auto"
        width={"100%"}  
        minHeight="200px"
        height={"auto"}
        maxH={`300px`}
        objectFit="cover"
        fallbackSrc="https://via.placeholder.com/200x300.png?text=Image+Not+Available"
        />
      <Text mt={2} fontSize={"sm"}>Converted image from input audio</Text>
    </Box>
  );
};

const PredictionBox = ({result}) => {
  const { is_spoof, score, model_used } = result;
  const label = is_spoof ? "Spoof" : "Genuine";
  const result_color = is_spoof ? "red.500" : "green.500";
  return (
    <Box
      p={3}
      w="100%"
      textAlign="center"
      color={"gray.700"}
      minH={`300px`}
      alignItems={"center"} 
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      
    >
      <Heading size="3xl" mb={2} fontWeight={"bold"}>Detection Result</Heading>
      <Text fontSize="lg" color="teal.700" fontWeight="bold">
        Model: {model_used || "Unknown"}</Text>
      <Text fontSize="lg" color={result_color} fontWeight={"700"}>Predicted : {label} </Text>
      <Text mt={2}>Confidence Score : {(score * 100).toFixed(3)}%</Text>
    </Box>
  );
};

const FullDisplay = ({ result, imageUrl }) => {
  return (
<Flex
      align="center"
      justify="center"
      w="100%"
      p={4}
      bg="gray.50" // optional background
    >
      <VStack
        align="center"
        p={2}
        spacing={6}
        w="100%"
        maxW="1000px"
        color="gray.800"
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="center"
          align="stretch"
          gap={8}
          w="100%"
        >
          <Box flex={1}>
            <ImageBox imageUrl={imageUrl} />
          </Box>
          <Box flex={1}>
            <PredictionBox result={result} />
          </Box>
        </Flex>
      </VStack>
    </Flex>
  );
};

export default FullDisplay;
