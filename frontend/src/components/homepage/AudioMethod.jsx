import { Box, Flex, Button, Text} from '@chakra-ui/react';   
import AudioRecorder from './RecordAudio';
import UploadAudio from './UploadAudio';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SubmitButton = ({ onClick, disabled }) =>{
    return (
    <Box w="100%" textAlign="center" mt={4}>
      <Button
        onClick={onClick}
        width="100%"
        size="lg"
        backgroundColor= 'teal.500'
              color= '#fff'
              border= 'none'
              padding= '0 1rem'
              borderRadius= '4px'
              fontWeight= 'bold'
              minW={"300px"}
              _hover={{ color: 'white', backgroundColor: 'teal.600' }}
              disabled={disabled}
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
  const [session_id, setSessionId] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async (file, source) => {
    setMessage('');
    setSessionId(null);
    setSelectedFile(file);
    setSourceType(source);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('source_type', source);

    try {
      const res = await fetch('/api/', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log('Upload response:', data);
      if (!res.ok) throw new Error(data.detail || 'Upload failed');

      setSessionId(data.session_id);
      console.log('Session ID:', data.session_id);
      setMessage('Audio uploaded successfully.');
    } catch (err) {
      setMessage(`Error uploading audio: ${err.message}`);
    }
  };


  const handleFileUpload = (file) => {
    handleUpload(file, 'upload');
  };

  const handleRecordingComplete = (file) => {
    handleUpload(file, 'record');
  };

  const handleSubmit = async () => {
    if (!session_id) {
      setMessage('Please upload or record audio first.');
      return;
    }

    const formData = new FormData();
     formData.append('session_id', session_id);
    if (selectedModel) {
      formData.append('model', selectedModel); 
    }

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${text}`);
      }

      const data = await res.json();
      if (!data.session_id) {
      throw new Error("Response missing session_id");
    }
      console.log("Prediction Data : ",data)
      navigate(`/result/${data.session_id}`);
      setMessage('Prediction submitted successfully. Redirecting to results...');
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

         <SubmitButton onClick={handleSubmit}  disabled={session_id == null || session_id === ''} />

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