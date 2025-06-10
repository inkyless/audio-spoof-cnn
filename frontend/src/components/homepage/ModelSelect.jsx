import { Flex,Box,Button,Text, HStack, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import {Link} from "react-router-dom";    

const ModelSelect = ({ selectedModel, onModelChange }) => {
  return (
 <HStack spacing={4}>
        <Button
          onClick={() => onModelChange('cnn')}
          bg={selectedModel === 'cnn' ? 'teal.500' : 'gray.400'}
          color={selectedModel === 'cnn' ? 'white' : 'gray.800'}
          _hover={{ bg: selectedModel === 'cnn' ? 'teal.500' : 'teal.300' }}
          fontWeight={selectedModel === 'cnn' ? 'bold' : 'normal'}
          variant="solid"
            cursor= 'pointer'

        >
          CNN
        </Button>
        <Button
          onClick={() => onModelChange('cnn-lstm')}
          bg={selectedModel === 'cnn-lstm' ? 'teal.500' : 'gray.400'}
          color={selectedModel === 'cnn-lstm' ? 'white' : 'gray.800'}
          _hover={{ bg: selectedModel === 'cnn-lstm' ? 'teal.500' : 'teal.300' }}
          fontWeight={selectedModel === 'cnn-lstm' ? 'bold' : 'normal'}
          variant="solid"
            cursor= 'pointer'

        >
          CNN-LSTM
        </Button>
      </HStack>
  );
}

const ModelSubmit = ({ onModelChange }) => {
  const [selectedModel, setSelectedModel] = useState("cnn");

  const handleModelChange = (model) => {
    setSelectedModel(model);
    if (onModelChange) {
      onModelChange(model);  // Notify parent
    }
  };

  return (
<Flex
  className="model-submit"
  direction="column"
  align="center"
  m="0.5em 1.5em 0.5em"
  gap={3}
  w="100%"
>
  <Box w="100%" maxW="700px">
    <Flex
      direction={{ base: "column", md: "row" }}
      align="center"
      flexWrap="wrap"
      justify={{ base: "center", md: "space-around" }}
      gap={3}
      w="100%"
    >
      <Text
        color="gray.800"
        minW={{ base: "auto", md: "180px" }}
        whiteSpace={{ base: "normal", md: "nowrap" }}
        textAlign={{ base: "center", md: "left" }}
      >
        Model <strong>{selectedModel.toUpperCase()}</strong> selected
      </Text>

      <ModelSelect
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
      />

      <Box
        w={{ base: "100%", md: "auto" }}
        flexGrow={{ base: 1, md: 0 }}
        flexShrink={0}
      >        
      </Box>
    </Flex>
  </Box>
</Flex>)
};

export default ModelSubmit;