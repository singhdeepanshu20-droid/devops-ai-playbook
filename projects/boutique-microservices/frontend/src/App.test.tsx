import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders boutique title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Luxury Boutique/i);
  expect(titleElement).toBeInTheDocument();
});
