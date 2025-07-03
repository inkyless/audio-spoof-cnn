import { Box, Button, Text, HStack, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  HandThumbsDownFill,
  HandThumbsUpFill,
  ArrowClockwise,
} from "react-bootstrap-icons";
import { API_BASE } from "../../utils/config";

// Props: result_id from the classified audio sample
const Feedback = ({ session_id,result_id }) => {
  const [feedback, setFeedback] = useState(null);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

const handleSubmit = async (isHelpful) => {
  if (!result_id || !session_id) {
    console.error("Error: result_id or session_id is missing, cannot submit feedback.");
    return;
  }

  const formData = new FormData();
  formData.append("session_id", session_id);
  formData.append("result_id", result_id);
  formData.append("feedback", isHelpful);


  try {
    const response = await fetch(`${API_BASE}/feedback/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Fetch error:", {
        status: response.status,
        data: errorData,
      });
      return;
    }

    setFeedback(isHelpful ? "yes" : "no");
    setSubmitted(true);
    setVisible(true);
  } catch (error) {
    console.error("Unexpected error:", error.message || error);
  }
};


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
    const response = await fetch(`${API_BASE}/feedback/${session_id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response?.json();
      console.error("Failed to delete feedback:", errorData?.detail || "Unknown error");
      return;
    }

    setFeedback(null);
    setSubmitted(false);
    setVisible(false);
  } catch (error) {
    console.error("Unexpected error:", error);
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
