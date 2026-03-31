import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { MovieStore } from './movie.store';
import { MovieService } from '../services/movie.service';

describe('MovieStore', () => {
  const movieServiceMock = {
    searchMovies: vi.fn(),
    getMovie: vi.fn()
  };

  beforeEach(() => {
    movieServiceMock.searchMovies.mockReset();
    movieServiceMock.getMovie.mockReset();

    TestBed.configureTestingModule({
      providers: [
        MovieStore,
        {
          provide: MovieService,
          useValue: movieServiceMock
        }
      ]
    });
  });

  it('search sets movies from API', () => {
    movieServiceMock.searchMovies.mockReturnValue(
      of({ page: 1, results: [{ id: 1, title: 'Inception' }], total_pages: 1, total_results: 1 })
    );

    const store = TestBed.inject(MovieStore);
    store.search('inc');

    expect(store.movies().length).toBe(1);
    expect(store.movies()[0]?.id).toBe(1);
  });

  it('loadMovie sets selectedMovie', () => {
    movieServiceMock.getMovie.mockReturnValue(of({ id: 99, title: 'Interstellar' }));
    const store = TestBed.inject(MovieStore);

    store.loadMovie(99);

    expect(store.selectedMovie()?.id).toBe(99);
  });
});

