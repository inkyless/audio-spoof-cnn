import React from 'react';
import { Flex, Center, Link, IconButton } from '@chakra-ui/react';
import { Github } from 'react-bootstrap-icons';

const accounts = [
  {
    url: 'https://github.com/MA-Ahmad/templateskart',
    label: 'Github Account',
    type: 'white',
    icon: <Github color='black'/>
  }
];

const CustomLink = ({ children }) => {
  return (
    <Link
      href="#"
      fontSize="sm"
      fontWeight="medium"
      color="gray.600"
      _hover={{ color: 'teal.600' }}
    >
      {children}
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
          icon={account.icon}
          variant="ghost"
          _hover={{ bg: 'gray.200' }}
          color={account.type === 'gray' ? 'gray.700' : undefined}                  
          size="md"
          isRound
        />
      ))}
    </Flex>
  );
};

// Final footer component
const Footer = () => {
  return (
    <Center px={4} bg="gray.50" flexDirection="row" py={2} gap={4} as={"footer"}>
      <CustomLink>© 2023 Spoof or Not</CustomLink>
      <AccountLink />
    </Center>
  );
};

export default Footer;
