import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardDisplay from '../components/CardDisplay';

describe('CardDisplay Component', () => {
  const mockData = [
    {
      id: 1,
      title: 'Inception',
      poster_path: '/path/to/inception.jpg'
    },
    {
      id: 2,
      title: 'Interstellar',
      poster_path: '/path/to/interstellar.jpg'
    }
  ];

  const mockOnMovieSelect = jest.fn();

  test('renders movie cards correctly', () => {
    render(<CardDisplay data={mockData} onMovieSelect={mockOnMovieSelect} />);

    mockData.forEach((movie) => {
      const image = screen.getByAltText(movie.title);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', `https://image.tmdb.org/t/p/w500${movie.poster_path}`);

      const title = screen.getByText(movie.title);
      expect(title).toBeInTheDocument();
    });
  });

  test('calls onMovieSelect when a view details button is clicked', () => {
    render(<CardDisplay data={mockData} onMovieSelect={mockOnMovieSelect} />);

    const firstMovieButton = screen.getAllByText('View Details')[0];
    fireEvent.click(firstMovieButton);

    expect(mockOnMovieSelect).toHaveBeenCalledWith(mockData[0]);
  });

});
