// jest.setup.js
import '@testing-library/jest-dom';

if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// jest.setup.js
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
