import { CloudUpload } from 'react-bootstrap-icons';
import { Button, FileUpload ,Box, Flex,List,ListItem, Wrap } from '@chakra-ui/react';
import RuleList
 from './ruleList';
const uploadRule = [
  'Allowed formats: .wav, .mp3, .flac, .aac, .ogg, .m4a',
  'Maximum file size: 5MB',
  'Avoid background noise as much as possible when recording speech',
  'Ideal audio quality is 16kHz; minimum acceptable is 8kHz'
];

const UploadDemo = () => {
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

        <Box>
          <FileUpload.Root accept={["audio/mp3", "audio/wav", "audio/flac"]} multiple>
            <FileUpload.HiddenInput />

            <Box mt={2} maxH="100px" overflowY="auto" width="100%">
              <FileUpload.List />
            </Box>

            <FileUpload.Trigger asChild>
              <Button
                variant="outline"
                size="sm"
                backgroundColor="teal.500"
                width="100%"
                color="white"
                _hover={{ bg: "teal.600" }}
                leftIcon={<CloudUpload size={18} />}
              >
                Upload file
              </Button>
            </FileUpload.Trigger>
          </FileUpload.Root>
        </Box>
      </Box>
    </Flex>
  );
};
export default UploadDemo;

