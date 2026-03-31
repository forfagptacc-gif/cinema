import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';

import { Movie } from '../data-access/models/movie.model';
import { MovieService } from '../data-access/services/movie.service';

export const movieResolver: ResolveFn<Movie> = (route) => {
  const api = inject(MovieService);
  const idRaw = route.paramMap.get('id');
  const id = Number(idRaw);

  if (!Number.isFinite(id) || id <= 0) {
    return throwError(() => new Error('Invalid movie id'));
  }

  return api.getMovie(id);
};

