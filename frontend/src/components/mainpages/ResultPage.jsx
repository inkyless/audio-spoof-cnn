import { defaultSystem } from "@chakra-ui/react"
import Header from "../Header";
import Footer from "../Footer";
import { ChakraProvider, Box, Flex, Text, Spinner, Button } from "@chakra-ui/react";
import Feedback from "../resultpage/feedback";
import FullDisplay from "../resultpage/resultDisplay";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ResultPage = () => {
  const navigate = useNavigate();
  const { session_id } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session_id) return;
    fetch(`/api/result/${session_id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch result');
        return res.json();
      })
      .then(data => {
        if (data.detail) throw new Error(data.detail);
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

  const portUrl = "http://localhost:8000";
  const imageFilename = result.image_filename || 'https://via.placeholder.com/200x300.png?text=Image+Not+Available';
  const imageUrl = `${portUrl}/api/output_images/${imageFilename}`;

  

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