import { defaultSystem } from "@chakra-ui/react"
import Header from "../Header";
import Footer from "../Footer";
import { ChakraProvider, Box, Flex, Text, Spinner, Button, Accordion, AccordionItem, AccordionItemTrigger,AccordionItemIndicator,AccordionItemContent, AccordionItemBody } from "@chakra-ui/react";
import Feedback from "../resultpage/feedback";
import FullDisplay from "../resultpage/resultDisplay";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_BASE } from '../../utils/config';

const Description = () => {
const items = [
  {
    value: 'a',
    title: 'How to Describe The Image?',
    text: 'The image is a visual representation of MFCC (Mel-Frequency Cepstral Coefficients) features extracted from the audio uploaded. MFCCs capture the short-term power spectrum of sound and are widely used in speech and audio analysis. The x-axis represents time, the y-axis represents the MFCC coefficient index, and the color intensity indicates the magnitude of each coefficient over time. This allows the model to detect patterns that distinguish between real and spoofed audio.',
  },
  {
    value: 'b',
    title: 'How to Understand The Confidence Score?',
    text: 'The confidence score indicates how certain the model is about its prediction. A score closer to 100% means high confidence that the audio is genuine or bonafide; closer to 0% suggests high confidence the audio is spoofed or fake. Scores in the middle reflect uncertainty.',
  },
    {
    value: 'c',
    title: 'Is this Result Accurate?',
    text: 'The accuracy of the result depends on the quality of the audio input and the model\'s training. While the model is designed to be robust, no system is perfect. It is recommended to use this tool as a supplementary check rather than a definitive answer.\nIn order to improve the performance of the model, you can give feedback below this section.',
  },
];

  return (
    <Accordion.Root collapsible>
      {items.map((item, index) => (
        <AccordionItem key={index} value={item.value} variant={"plain"} maxWidth={"90%"} justifyContent={"center"} margin={"1em auto"} borderRadius="md" boxShadow="md" mb={4} >
          <AccordionItemTrigger
            px={4}
            py={2}
            bg={"teal.500"}
            _hover={{ bg: 'teal.600' }}
            _expanded={{ bg: 'teal.400' }}
            padding={"0.5em 0"}
            borderRadius="md"
          >
            <Box flex="1" textAlign="justify" fontWeight="medium" ml={"2"}>
              {item.title}
            </Box>
            <AccordionItemIndicator />
          </AccordionItemTrigger>
          <AccordionItemContent>
            <AccordionItemBody px={4} py={2} fontSize="sm" textAlign="left" color="gray.700">
              {item.text}
            </AccordionItemBody>
          </AccordionItemContent>
        </AccordionItem>
      ))}
    </Accordion.Root>
  );
};


const ResultPage = () => {
  const navigate = useNavigate();
  const { session_id } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session_id) return;
    fetch(`${API_BASE}/result/${session_id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch result');
        return res.json();
      })
      .then(data => {
        if (data.detail) throw new Error(data.detail);
        console.log("Prediction Data : ",data)
        setResult(data);
      })
      .catch(err => setError(err.message));
  }, [session_id]);


  if (error) {
    return <Text color="red.500">Error: {error}</Text>;
  }

  if (!result) {
    return <Spinner size="xl" />;
  }

  const imageFilename = result.image_filename || 'https://via.placeholder.com/200x300.png?text=Image+Not+Available';
  const imageUrl = `${API_BASE}/api/output_images/${imageFilename}`;


  const handleReturn = () => {
    navigate(-1); // Go back to the previous page
  };

       return(
        <ChakraProvider value={defaultSystem}>  
          <Flex direction="column" minH="100vh">
            <Box as="header" data-state="open"
              _open={{
                animation: "fade-in 300ms ease-out",
              }}>
              <Header />
              <Button 
              mt={4}
              onClick={handleReturn}
              backgroundColor="teal.600"
              _hover={{ bg: "teal.700" }}
              size="md"
              borderRadius="md"
              width={"100%"}
            >
              Return
            </Button>
            </Box>
            <Box as="main" flex="1" >
              {result ? <FullDisplay result={result} imageUrl={imageUrl} /> : <p>Loading...</p>}
            <Description />

              <Feedback  session_id={result.session_id} result_id={result.result_id} />
            </Box>
            <Box as="footer">
              <Footer />
            </Box>
          </Flex>
        </ChakraProvider>
       ) 
}

export default ResultPage;