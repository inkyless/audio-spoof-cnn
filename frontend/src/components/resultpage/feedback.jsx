import { Box, Button, Text, HStack, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  HandThumbsDownFill,
  HandThumbsUpFill,
  ArrowClockwise,
} from "react-bootstrap-icons";
import axios from "axios";

// Props: result_id from the classified audio sample
const Feedback = ({ session_id,result_id }) => {
  const [feedback, setFeedback] = useState(null);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (isHelpful) => {
    if (!result_id && !session_id) {
      console.error("Error: result_id or session_id is missing, cannot submit feedback.");
      return;
    }

    const formData = new FormData();
    formData.append("session_id", session_id);
    formData.append("result_id", result_id);
    formData.append("feedback", isHelpful);

    try {
      await axios.post("/api/feedback", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

      setFeedback(isHelpful ? "yes" : "no");
      setSubmitted(true);
      setVisible(true);
    } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error("Unexpected error:", error);
    }
  };
}

  // Trigger fade-in animation when feedback changes
  useEffect(() => {
    if (submitted) {
      setVisible(false);
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [submitted]);

  const handleUndo = async () => {
    if (!result_id || !session_id) {
    console.error("Missing result_id or session_id for undo.");
    return;
  }

  try {
    await axios.delete("/api/feedback", {
      params: {
        session_id: session_id,
        result_id: result_id,
      },
    });

    setFeedback(null);
    setSubmitted(false);
    setVisible(false);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to delete feedback:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
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
        <Text fontSize="md" color="gray.600" flex={1}>
              {message}
         </Text>
        {!submitted ? (
            <HStack spacing={4}>
              <Button
                bg="teal.600"
                size="lg"
                onClick={() => handleSubmit(true)}
                _hover={{ bg: "teal.700" }}
                disabled={!result_id || !session_id}
              >
                <HandThumbsUpFill size={24} />
                &nbsp;Yes
              </Button>
              <Button
                bg="red.600"
                size="lg"
                onClick={() => handleSubmit(false)}
                _hover={{ bg: "red.700" }}
                disabled={!result_id || !session_id}
              >
                <HandThumbsDownFill size={24} />
                &nbsp;No
              </Button>
            </HStack>
        ) : (
            <Button
              variant="outline"
              backgroundColor="gray.500"
              size="md"
              onClick={() => handleUndo()}
              style={fadeStyle}
              _hover={{ bg: "gray.600" }}
            >
              <ArrowClockwise size={24} />
              &nbsp;Undo
            </Button>
        )}
      </Flex>
      {(!result_id || !session_id) && (
        <Text mt={3} fontSize="sm" color="red.500">
          Missing session_id or result_id. Feedback cannot be submitted.
        </Text>
      )}
    </Box>
  );
};

export default Feedback;
