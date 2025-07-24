import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  Box,
  VStack,
  Image,
  Text,
  Heading,
  Flex,
  Icon,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { QuestionCircle } from "react-bootstrap-icons";

const ImageBox = ({ imageUrl, onTrigger }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      w="100%"
      textAlign="center"
      padding={2}
      minW="70%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Image
        src={imageUrl}
        alt="Converted Image"
        borderRadius="md"
        mx="auto"
        width="100%"
        minHeight="200px"
        height="auto"
        maxH="300px"
        objectFit="cover"
        fallbackSrc="https://via.placeholder.com/200x300.png?text=Image+Not+Available"
      />

      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent={"center"}
        mt={2}
        gap={5}
        textAlign={"center"}
      >
        <Icon as={QuestionCircle} boxSize={4} color={"teal.500"} mr={1} />
        <span
          data-tooltip-id="image-tooltip"
          data-tooltip-content="Click to know what is this image!"
          style={{ cursor: "pointer" }}
          onClick={() => {
            console.log("Trigger clicked, opening value:", "a");
            onTrigger("a");
          }}
        >
          <ChakraLink
            as="span"
            fontSize="sm"
            color="teal.500"
            textDecoration="underline"
          >
            Converted image from input audio
          </ChakraLink>
        </span>
        <ReactTooltip id="image-tooltip" place="top" />
      </Flex>
    </Box>
  );
};

const PredictionBox = ({ result, onTrigger }) => {
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
      <Heading size="3xl" mb={2} fontWeight={"bold"}>
        Detection Result
      </Heading>
      <Text fontSize="lg" color="teal.700" fontWeight="bold">
        Model: {model_used || "Unknown"}
      </Text>
      <Text fontSize="lg" color={result_color} fontWeight={"700"}>
        Predicted : {label}
      </Text>

      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent={"center"}
        mt={2}
        gap={5}
        textAlign={"center"}
      >

        <Box flexDirection={"column"}>
          <Text mt={2}>Confidence Score :</Text>
          <span
            data-tooltip-id="score-tooltip"
            data-tooltip-content="Click to know how to understand this score!"
            style={{ cursor: "pointer" }}
            onClick={() => {
              console.log("Trigger clicked, opening value:", "b");
              onTrigger("b");
            }}
          >
            <ChakraLink
              as="span"
              fontSize="md"
              color="teal.500"
              textDecoration="underline"
              
            >
            <Icon as={QuestionCircle} boxSize={4} color={"teal.500"} mr={1} />

              {(score * 100).toFixed(3)}%
            </ChakraLink>
          </span>
          <ReactTooltip id="score-tooltip" place="top" />
        </Box>
      </Flex>
    </Box>
  );
};


const FullDisplay = ({ result, imageUrl, setOpenValue }) => {
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
            <ImageBox imageUrl={imageUrl} onTrigger={setOpenValue} />
          </Box>
          <Box flex={1}>
            <PredictionBox result={result} onTrigger={setOpenValue}/>
          </Box>
        </Flex>
      </VStack>
    </Flex>
  );
};

export default FullDisplay;
