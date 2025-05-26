import React, { useRef, useState } from 'react';
import { Box, Button, Flex, Text,List,ListItem } from '@chakra-ui/react';
import { StopCircle, RecordFill } from 'react-bootstrap-icons';
import RuleList from './ruleList';
const recordRule = [
  'User must allow first microphone access from browsers ',
  'The maximum recording duration to be taken is 10 seconds',
  'This feature will be available for browsers with supported MediaRecorderAPI and WebAudioAPI',
]

const AudioRecorder = () => {
    const [recordedUrl, setRecordedUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(recordedBlob);
        setRecordedUrl(url);
        chunks.current = [];
      };

    

      mediaRecorder.current.start();
      setIsRecording(true);
      setElapsedTime(0);



      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev >= 9) {
            // Stop recording after 10 seconds
            stopRecording();
            return prev; // stop updating elapsedTime after stop
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
        <audio controls src={recordedUrl} style={{ width: '100%' }} />

        <Flex gap={4}>
                   <Button
            size="sm"
            colorScheme="red"
            onClick={stopRecording}
            backgroundColor="#D10524"
            _hover={{ bg: '#941125FF' }}
            isDisabled={!isRecording}
          >
            <StopCircle /> Stop
          </Button>
          <Button
            size="sm"
            colorScheme="teal"
            onClick={startRecording}
            backgroundColor="teal.500"
            _hover={{ bg: 'teal.600' }}
            isDisabled={isRecording}
          >
            <RecordFill /> Start
          </Button>

        </Flex>
      </Flex>
    </Box>
  );
};

export default AudioRecorder;
