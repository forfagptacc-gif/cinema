import { Routes } from '@angular/router';

export const FAVORITES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./movie-favorites-page.component').then((m) => m.MovieFavoritesPageComponent)
  }
];

