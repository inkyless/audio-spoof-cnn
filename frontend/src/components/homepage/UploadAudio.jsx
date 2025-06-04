import { CloudUpload } from 'react-bootstrap-icons';
import { Button, Input ,Box, Flex,Text, Spinner } from '@chakra-ui/react';
import RuleList from './RuleList';
import React, { useState, useRef } from 'react';

const uploadRule = [
  'Allowed formats: .wav, .mp3, .flac, .aac, .ogg, .m4a',
  'Maximum file size: 5MB',
  'Avoid background noise as much as possible when recording speech',
  'Ideal audio quality is 16kHz; minimum acceptable is 8kHz'
];

const UploadAudio = ({ onFileSelected }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null); 
  const [message, setMessage] = useState('');

  const handleFileChange = async (event) => {
    const selected  = event.target.files[0];
    if (!selected) return;

    setFile(selected);
    onFileSelected(selected);
    setMessage('');
  

  const formData = new FormData();
  formData.append('file', selected);
  formData.append('source_type', 'upload'); 
  formData.append('model', 'cnn'); // default

  try {
    setIsUploading(true);
    const response = await fetch('http://127.0.0.1:8000/', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setIsUploading(false);

    if (!response.ok) throw new Error(data.detail || 'Upload failed');
    setMessage(`Upload successful: ${selected.name}`);
    console.log('Response:', data);
  } catch (err) {
    setIsUploading(false);
    setMessage(`Error: ${err.message}`);
  }
};

  const handleButtonClick = () => {
    inputRef.current.click(); 
  };


  return (
    <Flex direction="column" align="center" gap={4}>
      <Box
        borderWidth="1px"
        borderRadius="2xl"
        p={6}
        boxShadow="md"
        bg="white"
        maxW="400px"
        minH="320px"
        w="100%"
        display="flex"             
        flexDirection="column"   
      >
        <Box flex="1">
          <RuleList rules={uploadRule} />
        </Box>

        <Flex gap={4} align="center">
          <Input
            ref={inputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            p={1}
            _hover={{ borderColor: "teal.500" }}
            bg="white"
            size="sm"
            width={"30%"}
            flexShrink={0}  />

          {file && file.name && (
            <Text fontSize="sm" mt={2} color="gray.600" flex={1} marginBottom={2} isTruncated>
               {file.name}
            </Text>
          )}
        </Flex>

        <Box mt={3}>
          <Button
            backgroundColor="teal.600"
            color="white"
            _hover={{ backgroundColor: 'teal.700' }}
            onClick={handleButtonClick}
            flexShrink={0}
            width={'100%'}
            isDisabled={isUploading}
          >
            {isUploading ? <Spinner size="sm" /> : <CloudUpload size={18} />}
            {isUploading ? 'Uploading...' : 'Select File'}
          </Button>
        </Box>

        {message && isUploading &&  (
          <Text mt={3} fontSize="sm" color={message.startsWith("Error") ? "red.500" : "green.600"}>
            {message}
          </Text>
        )}
      </Box>
    </Flex>
  );
};
export default UploadAudio;

