import React from 'react';
import { Flex, Center, Link, IconButton } from '@chakra-ui/react';
import { Github } from 'react-bootstrap-icons';

const accounts = [
  {
    url: 'https://github.com/inkyless/audio-spoof-cnn',
    label: 'Github',
    type: 'black',
    icon: <Github color='black'/>
  }
];

const CustomLink = ({ text }) => {
  return (
    <Link
      fontSize="sm"
      fontWeight="medium"
      color="gray.600"
      _hover={{color:"teal.600"}}
    >
      {text}
    </Link>
  );
};

const AccountLink = () => {
  return (
    <Flex gap={4}>
      {accounts.map((account) => (
        <IconButton
          key={account.label}
          as="a"
          href={account.url}
          target="_blank"
          aria-label={account.label}
          variant="ghost"
          colorPalette={account.type}
          _hover={{ bg: 'gray.200' }}
          color={account.type === 'gray.600' ? 'gray.700' : undefined}                  
          size="lg"
          rounded={"full"}
        >
          {account.icon}
          </IconButton>
      ))}

    </Flex>
  );
};

// Final footer component
const Footer = () => {
  return (
    <Center px={4} bg="gray.50" flexDirection="row" py={2} gap={4} as={"footer"}>
      <CustomLink text={"© 2023 Spoof or Not"}></CustomLink>
      <AccountLink />
    </Center>
  );
};

export default Footer;
