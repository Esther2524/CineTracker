import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotFoundPage from '../pages/NotFoundPage';

describe('NotFoundPage Component', () => {
  test('renders 404 Not Found message', () => {
    render(<NotFoundPage />);
    
    const headingElement = screen.getByRole('heading', { name: /404 - Not Found/i });
    expect(headingElement).toBeInTheDocument();

    const paragraphElement = screen.getByText(/sorry, the page you are looking for does not exist\./i);
    expect(paragraphElement).toBeInTheDocument();
  });
});
