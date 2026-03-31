import { Routes } from '@angular/router';

export const SEARCH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./movie-search-page.component').then((m) => m.MovieSearchPageComponent)
  }
];

