import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach } from 'vitest';

import { MovieService } from './movie.service';
import { ConfigService } from '@core/config.service';

describe('MovieService', () => {
  let service: MovieService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MovieService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ConfigService,
          useValue: { api: { baseUrl: 'https://example.test', apiKey: 'key' } }
        }
      ]
    });

    service = TestBed.inject(MovieService);
    http = TestBed.inject(HttpTestingController);
  });

  it('searchMovies sends query and page params', () => {
    service.searchMovies('batman', 2).subscribe((res) => {
      expect(res.page).toBe(2);
      expect(res.results.length).toBe(1);
    });

    const req = http.expectOne(
      (r) => r.url === 'https://example.test/search/movie' && r.params.get('query') === 'batman'
    );
    expect(req.request.params.get('page')).toBe('2');
    req.flush({ page: 2, results: [{ id: 1 }], total_pages: 3, total_results: 1 });
  });

  it('getPopularMovies requests /movie/popular with page', () => {
    service.getPopularMovies(3).subscribe((res) => {
      expect(res.page).toBe(3);
    });

    const req = http.expectOne(
      (r) => r.url === 'https://example.test/movie/popular' && r.params.get('page') === '3'
    );
    expect(req.request.params.get('api_key')).toBe('key');
    req.flush({ page: 3, results: [{ id: 2 }], total_pages: 10, total_results: 100 });
  });
});

