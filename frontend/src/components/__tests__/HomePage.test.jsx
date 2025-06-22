import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../mainpages/HomePage'; 
import '@testing-library/jest-dom';
import {jest, expect, describe, test} from '@jest/globals';

jest.mock('../../components/Header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('../../components/Footer', () => () => <div data-testid="mock-footer">Footer</div>);
jest.mock('../../components/homepage/AudioMethod', () => () => <div data-testid="mock-audio-method">AudioMethod</div>);
jest.mock('../../components/homepage/ModelSelect', () => ({ onModelChange }) => (
  <div data-testid="mock-model-submit" onClick={() => onModelChange('cnn')}>ModelSubmit</div>
));

describe('HomePage', () => {
  test('renders Header, AudioMethod, ModelSubmit, and Footer', () => {
    render(<HomePage />);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-audio-method')).toBeInTheDocument();
    expect(screen.getByTestId('mock-model-submit')).toBeInTheDocument();
  });

  test('updates selectedModel state via ModelSubmit interaction', () => {
    render(<HomePage />);

    const modelSubmit = screen.getByTestId('mock-model-submit');
    modelSubmit.click(); // simulate click that calls onModelChange

    // Since there's no visual change, you can only assert that no crash occurred.
    // You may use React Testing Library’s `fireEvent` or `userEvent` for deeper simulation if needed.
    expect(modelSubmit).toBeInTheDocument();
  });
});