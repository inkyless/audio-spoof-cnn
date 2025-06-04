import { Box, Button, Text, HStack, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  HandThumbsDownFill,
  HandThumbsUpFill,
  ArrowClockwise,
} from "react-bootstrap-icons";
import axios from "axios";

// Props: resultId from the classified audio sample
const Feedback = ({ resultId }) => {
  const [feedback, setFeedback] = useState(null);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle backend submission
  const handleSubmit = async (isHelpful) => {
    try {
      await axios.post("http://localhost:8000/feedback/", {
        result_id: resultId,
        feedback: isHelpful,
      });
      setFeedback(isHelpful ? "yes" : "no");
      setSubmitted(true);
    } catch (err) {
      console.error("Feedback failed:", err);
    }
  };

  // Trigger fade-in animation when feedback changes
  useEffect(() => {
    if (submitted) {
      setVisible(false);
      const timer = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [submitted]);

  const handleUndo = () => {
    setFeedback(null);
    setSubmitted(false);
  };

  const message =
    feedback === "yes" || feedback === "no"
      ? "Thank you for your feedback. It has been recorded to help improve future results."
      : "Was this result accurate? Help us improve by confirming if our prediction was correct.";

  const fadeStyle = {
    opacity: visible ? 1 : 0,
    transition: "opacity 1.5s ease",
  };

  return (
    <Box maxW="900px" mx="auto" textAlign="center" p={4}>
      <Flex
        align="center"
        justify="center"
        wrap="wrap"
        gap={4}
        direction={{ base: "column", md: "row" }}
      >
        {!submitted ? (
          <>
            <Text fontSize="md" color="gray.600" flex={1}>
              {message}
            </Text>
            <HStack spacing={4}>
              <Button
                bg="teal.600"
                size="lg"
                onClick={() => handleSubmit(true)}
                _hover={{ bg: "teal.700" }}
              >
                <HandThumbsUpFill size={24} />
                &nbsp;Yes
              </Button>
              <Button
                bg="red.600"
                size="lg"
                onClick={() => handleSubmit(false)}
                _hover={{ bg: "red.700" }}
              >
                <HandThumbsDownFill size={24} />
                &nbsp;No
              </Button>
            </HStack>
          </>
        ) : (
          <>
            <Text fontSize="md" color="gray.600" style={fadeStyle} flex={1}>
              {message}
            </Text>
            <Button
              variant="outline"
              backgroundColor="gray.500"
              size="md"
              onClick={handleUndo}
              style={fadeStyle}
              _hover={{ bg: "gray.600" }}
            >
              <ArrowClockwise size={24} />
              &nbsp;Undo
            </Button>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default Feedback;
