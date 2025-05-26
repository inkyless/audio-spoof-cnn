import React from 'react';  
import { Box } from '@chakra-ui/react';


const RuleList = ({ rules = [] }) => {
  return (
    <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
      {rules.map((rule, index) => (
        <li key={index} style={{ fontSize: '0.875rem', color: '#4A5568', listStyleType: 'disc', marginBottom: '0.5rem' }}>
          {rule}
        </li>
      ))}
    </ul>
  );
};

export default RuleList;
