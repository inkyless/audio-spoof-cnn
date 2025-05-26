import { Heading, Flex, Separator, Highlight, Center,Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import * as Icons from "react-bootstrap-icons"
import { useLocation } from "react-router-dom";

const HomeHeading = ()=> {
  return (
          <Text color="fg.muted" textAlign={"center"} fontSize={"lg"}>
          Upload or record your voice to find out if it's genuine - 
          powered by cutting-edge AI spoof detection.
         </Text>
  );
}

const ResultButton = ()=> {
  return (
          <Button variant="solid" backgroundColor="teal.600" size="lg" as={Link} to="/" color={"white"} _hover={{bg:"teal.700", color:"white"}} minW={"60%"} >
            <Icons.ArrowCounterclockwise size={20} color={"white"} />
            Try Again?
          </Button>
  );
}

const Header = () => {
  const location = useLocation();
  return (
    <Center
       margin={"1rem 1rem 0"}>
    <Flex align={"center"} justify={"center"} flexDirection={"column"} gap={4}>
        <Flex align={"center"} justify={"center"} gap={5}>
          <Icons.Soundwave size={80} color={"teal.600"} />
          <Heading as="h1" size="lg" fontWeight={"bold"} textAlign={"center"} color={"black"}>
            <Highlight query="Spoof" styles={{color:"teal.600"}} >
               Spoof or Not?
            </Highlight>
           </Heading>
        </Flex>

        {location.pathname === "/" && <HomeHeading />}
        {location.pathname === "/result" && <ResultButton />}

        <Separator />
      </Flex>
      </Center>    

  );
};

export default Header;