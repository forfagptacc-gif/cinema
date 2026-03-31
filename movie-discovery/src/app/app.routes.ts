import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'search' },
  {
    path: 'search',
    loadChildren: () =>
      import('./features/movies/feature-search/search.routes').then((r) => r.SEARCH_ROUTES)
  },
  {
    path: 'movie/:id',
    loadChildren: () =>
      import('./features/movies/feature-details/details.routes').then((r) => r.DETAILS_ROUTES)
  },
  {
    path: 'favorites',
    loadChildren: () =>
      import('./features/movies/feature-favorites/favorites.routes').then((r) => r.FAVORITES_ROUTES)
  },
  { path: '**', redirectTo: 'search' }
];
