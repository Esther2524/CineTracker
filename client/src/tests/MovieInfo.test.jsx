import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MovieInfo from '../components/MovieInfo';

describe('MovieInfo Component', () => {
  const mockMovie = {
    title: 'Inception',
    tagline: 'Your mind is the scene of the crime.',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology...',
    genres: [{ name: 'Action' }, { name: 'Adventure' }],
    release_date: '2010-07-16'
  };

  test('renders movie information correctly', () => {
    render(<MovieInfo movie={mockMovie} />);
    
    expect(screen.getByRole('heading', { name: mockMovie.title })).toBeInTheDocument();
    expect(screen.getByText(mockMovie.tagline)).toBeInTheDocument();
    expect(screen.getByText(`Overview: ${mockMovie.overview}`)).toBeInTheDocument();
    expect(screen.getByText(`Genres: ${mockMovie.genres.map(genre => genre.name).join(', ')}`)).toBeInTheDocument();
    expect(screen.getByText(`Release Date: ${mockMovie.release_date}`)).toBeInTheDocument();
  });
});
