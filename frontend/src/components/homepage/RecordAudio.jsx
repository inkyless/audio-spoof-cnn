import React, { useRef, useState } from 'react';
import { Box, Button, Flex, Text,List,ListItem } from '@chakra-ui/react';
import { StopCircle, RecordFill } from 'react-bootstrap-icons';
import RuleList from './RuleList';

const recordRule = [
  'User must allow first microphone access from browsers ',
  'The maximum recording duration to be taken is 10 seconds',
  'This feature will be available for browsers with supported MediaRecorderAPI and WebAudioAPI',
]

const AudioRecorder = ({ onRecordingStop }) => {
 const [recordedUrl, setRecordedUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const intervalRef = useRef(null);
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
          const blob = new Blob(chunks.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedUrl(url);

          const file = new File([blob], 'recorded_audio.webm', { type: 'audio/webm' });
          if (onRecordingStop) {
            onRecordingStop(file); // optional callback
        };

        // Auto upload to backend
          const formData = new FormData();
          formData.append('file', file);
          formData.append('source_type', 'record'); // Important: required by FastAPI
          formData.append('model', 'cnn'); // Optional

          try {
            setIsUploading(true);
            setUploadMessage('');
            const response = await fetch('/api/', {
              method: 'POST',
              body: formData,
          });

          const data = await response.text();

           if (!response.ok) throw new Error(data.detail || 'Upload failed');

          setIsUploading(false);
          console.log("Response Data:", data)
        } catch (err) {
          setIsUploading(false);
          console.error(err)
          setUploadMessage(`Error: ${err.message}`);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setElapsedTime(0);

      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev >= 9) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    clearInterval(intervalRef.current);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="2xl"
      p={6}
      boxShadow="md"
      bg="white"
      maxW="400px"
        maxH="350px"
      w="100%"
      className="upload-card"
    >
      <Flex direction="column" align="center" gap={4} >

        <RuleList rules={recordRule} />
        {isRecording && (
          <Text fontSize="sm" color="gray.600">
            Recording time: {elapsedTime}s
          </Text>
        )}
        {recordedUrl && (
        <audio controls src={recordedUrl} style={{ width: '100%' }} />
      )}

        <Flex gap={4}>
                   <Button
            size="sm"
            colorScheme="red"
            onClick={stopRecording}
            backgroundColor="red.500"
            _hover={{ bg: 'red.600' }}
            isDisabled={!isRecording || isUploading}
            flex={1}
          >
            <StopCircle /> Stop
          </Button>
          <Button
            size="sm"
            colorScheme="teal"
            onClick={startRecording}
            backgroundColor="teal.500"
            _hover={{ bg: 'teal.600' }}
            isDisabled={isRecording || isUploading}
            flex={1}
          >
            <RecordFill /> Start
          </Button>
        </Flex>

        {uploadMessage && (
          <Text mt={3} fontSize="sm" color={uploadMessage.startsWith('Error') ? 'red.500' : 'green.600'}>
            {uploadMessage}
          </Text>
        )}

      </Flex>
    </Box>
  );
};

export default AudioRecorder;
