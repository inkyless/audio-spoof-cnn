import { Box, Flex, Button, Text} from '@chakra-ui/react';   
import AudioRecorder from './RecordAudio';
import UploadAudio from './UploadAudio';
import React, { useState } from 'react';

const SubmitButton = ({ onClick }) =>{
    return (
    <Box w="100%" textAlign="center" mt={4}>
      <Button
        onClick={onClick}
        width="100%"
        colorScheme="teal"
        size="lg"
        backgroundColor= 'teal.500'
              color= '#fff'
              border= 'none'
              padding= '0 1rem'
              borderRadius= '4px'
              cursor= 'pointer'
              fontWeight= 'bold'
              flex={4}
              minW={"300px"}
              _hover={{ color: 'white', backgroundColor: 'teal.600' }}
    >
      Submit
    </Button>
  </Box>

    );
}

const AudioMethod = ({selectedModel}) => {
  const [selectedFile, setSelectedFile] = useState(null); // latest audio input
  const [sourceType, setSourceType] = useState(null); // "upload" or "record"
  const [message, setMessage] = useState('');

  const handleFileUpload = (file) => {
    setSelectedFile(file);
    setSourceType('upload');
    setMessage('');
  };

  const handleRecordingComplete = (file) => {
    setSelectedFile(file);
    setSourceType('record');
    setMessage('');
  };

  const handleSubmit = async () => {
    if (!selectedFile || !sourceType) {
      setMessage('Please upload or record audio first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('source_type', sourceType);  
    if (selectedModel) {
      formData.append('model', selectedModel); 
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Upload failed');

      setMessage(`Success. Interaction ID: ${data.interaction_id}`);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

return (
    <Box w="100%" maxW="800px" mx="auto" mt={8}>
      <Flex
        alignItems="center"
        justify="center"
        direction={{ base: "column", md: "row" }}
        gap={6}
        w="100%"
      >
        <UploadAudio onFileSelected={handleFileUpload} />
        <AudioRecorder onRecordingStop={handleRecordingComplete} />
      </Flex>

      <Box textAlign="center">

        {selectedFile && (
          <Text mt={2} fontSize="sm">
            Selected from: <strong>{sourceType}</strong> – {selectedFile.name}
          </Text>
        )}

         <SubmitButton onClick={handleSubmit} />

        {message && (
          <Text mt={2} fontSize="sm" color={message.startsWith('Error') ? 'red.500' : 'green.600'}>
            {message}
          </Text>
        )}
      </Box>
    </Box>
  );
}

export default AudioMethod;