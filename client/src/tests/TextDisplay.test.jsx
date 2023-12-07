import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import TextDisplay from '../components/TextDisplay';

describe('TextDisplay Component', () => {
  const mockMovie = {
    apiId: '123',
    title: 'Interstellar',
    updatedAt: '2021-01-01T00:00:00Z',
    rating: '5',
    review: 'A fantastic journey through space and time.'
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  test('renders movie information correctly', () => {
    render(
      <Router>
        <TextDisplay movie={mockMovie} formatDate={formatDate} />
      </Router>
    );

    const linkElement = screen.getByRole('link', { name: mockMovie.title });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', `/details/${mockMovie.apiId}`);

    expect(screen.getByText(`Rated and Reviewed at ${formatDate(mockMovie.updatedAt)}`)).toBeInTheDocument();
    expect(screen.getByText(`My Rating: ${mockMovie.rating}`)).toBeInTheDocument();
    expect(screen.getByText(`My Review: ${mockMovie.review}`)).toBeInTheDocument();
  });
});
