import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'search' },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/movies/feature-search/movie-search-page.component').then(
        (m) => m.MovieSearchPageComponent
      )
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./features/movies/feature-details/movie-details-page.component').then(
        (m) => m.MovieDetailsPageComponent
      ),
    resolve: {
      movie: () =>
        import('./features/movies/feature-details/movie.resolver').then((r) => r.movieResolver)
    }
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/movies/feature-favorites/movie-favorites-page.component').then(
        (m) => m.MovieFavoritesPageComponent
      )
  },
  { path: '**', redirectTo: 'search' }
];
