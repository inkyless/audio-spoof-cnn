import { Box, Button, Text, HStack,Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { HandThumbsDownFill,HandThumbsUpFill,ArrowClockwise } from "react-bootstrap-icons";

const Feedback = () => {
  const [feedback, setFeedback] = useState(null);
  const [visible, setVisible] = useState(false);

  // Trigger fade-in animation when feedback changes
  useEffect(() => {
    if (feedback !== null) {
      setVisible(false);
      // small delay to trigger transition
      const timer = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [feedback]);

  const handleUndo = () => setFeedback(null);


  const message =
  feedback === "yes"
    ? "Thank you for your feedback. It has been recorded to help improve future results."
    : feedback === "no"
    ? "Thank you for your feedback. It has been recorded to help improve future results."
    : "Was this result accurate? Help us improve by confirming if our prediction was correct.";

    const fadeStyle = {
    opacity: visible ? 1 : 0,
    transition: "opacity 1.5s ease",
  };


  return (
  <Box maxW="900px" mx="auto" textAlign="center" p={2}>
      <Flex
        align="center"
        justify="center"
        wrap="wrap"
        gap={4}
        direction={{ base: "column", md: "row" }}
      >
        {feedback === null ? (
          <>
          <Text fontSize="md" color="gray.600" flex={1}>
            {message}
          </Text>
            <HStack spacing={4}>
              <Button
                bg="teal.600"
                size="lg"
                onClick={() => setFeedback("yes")}
                 _hover={{ bg: "teal.700" }}
              >
                <HandThumbsUpFill size={24} />Yes
              </Button>
              <Button
                bg="red.600"
                size="lg"
                onClick={() => setFeedback("no")}
                 _hover={{ bg: "red.700" }}
              >
                <HandThumbsDownFill size={24} />No
              </Button>
            </HStack>
          </>
        ) : (
          <>
            <Text fontSize="md" color="gray.600" style={fadeStyle} flex={1}>
            {message}
          </Text>
            <Button variant="outline" backgroundColor={"gray.500"} size="md" onClick={handleUndo} style={fadeStyle} _hover={{ bg: "gray.600" }}>
              <ArrowClockwise size={24}/>Undo
            </Button>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default Feedback;