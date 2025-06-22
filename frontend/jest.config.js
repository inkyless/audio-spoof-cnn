module.exports = {
  testEnvironment: 'jsdom',

  clearMocks: true,

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],

  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],

  extensionsToTreatAsEsm: ['.jsx'], // removed '.js'

  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
};
