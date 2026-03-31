import { Injectable, signal } from '@angular/core';

import { StorageService } from '@core/storage.service';
import { Movie } from '../models/movie.model';

const STORAGE_KEY = 'favorites.movies.v1';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly favoritesSignal = signal<Movie[]>([]);

  constructor(private readonly storage: StorageService) {
    this.favoritesSignal.set(this.storage.get<Movie[]>(STORAGE_KEY, []) ?? []);
  }

  readonly favorites = this.favoritesSignal.asReadonly();

  has(movieId: number): boolean {
    return this.favoritesSignal().some((m) => m.id === movieId);
  }

  toggle(movie: Movie): void {
    if (this.has(movie.id)) {
      this.remove(movie.id);
      return;
    }
    this.add(movie);
  }

  add(movie: Movie): void {
    const current = this.favoritesSignal();
    if (current.some((m) => m.id === movie.id)) return;
    const next = [movie, ...current];
    this.persist(next);
  }

  remove(movieId: number): void {
    const next = this.favoritesSignal().filter((m) => m.id !== movieId);
    this.persist(next);
  }

  private persist(next: Movie[]): void {
    this.favoritesSignal.set(next);
    this.storage.set(STORAGE_KEY, next);
  }
}

