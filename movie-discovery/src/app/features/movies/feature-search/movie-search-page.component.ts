import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Movie } from '../data-access/models/movie.model';
import { MovieService } from '../data-access/services/movie.service';
import { LoaderComponent } from '@shared/ui/loader/loader.component';
import { EmptyStateComponent } from '@shared/ui/empty-state/empty-state.component';
import { MovieCardComponent } from '../ui/movie-card/movie-card.component';

@Component({
  selector: 'app-movie-search-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LoaderComponent,
    EmptyStateComponent,
    MovieCardComponent
  ],
  template: `
    <section class="page">
      <header class="page__header">
        <h2 class="page__title">Поиск</h2>
        <p class="page__subtitle">Введите минимум 2 символа.</p>
      </header>

      <div class="search">
        <input
          class="search__input"
          [formControl]="queryControl"
          placeholder="Например: Inception"
          autocomplete="off"
        />
      </div>

      <app-loader *ngIf="loading()"></app-loader>

      <app-empty-state
        *ngIf="!loading() && error()"
        title="Ошибка"
        [subtitle]="error()"
      />

      <app-empty-state
        *ngIf="!loading() && !error() && showEmpty()"
        title="Ничего не найдено"
        subtitle="Попробуйте другой запрос."
      />

      <div class="grid" *ngIf="!loading() && !error() && movies().length">
        <a class="grid__item" *ngFor="let m of movies(); trackBy: trackById" [routerLink]="['/movie', m.id]">
          <app-movie-card [movie]="m" />
        </a>
      </div>
    </section>
  `,
  styles: [
    `
      .page {
        padding: 1rem 0 2rem;
      }
      .page__header {
        margin-bottom: 1rem;
      }
      .page__title {
        margin: 0 0 0.25rem;
      }
      .page__subtitle {
        margin: 0;
        opacity: 0.7;
      }

      .search {
        margin: 0.75rem 0 0.5rem;
      }
      .search__input {
        width: 100%;
        padding: 0.9rem 1rem;
        border-radius: 14px;
        border: 1px solid var(--border-subtle);
        background: var(--bg-elevated);
        color: var(--text);
        outline: none;
      }
      .search__input:focus {
        border-color: rgba(255, 107, 107, 0.45);
        box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.12);
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 0.9rem;
        margin-top: 1rem;
      }
      .grid__item {
        text-decoration: none;
        color: inherit;
      }
    `
  ]
})
export class MovieSearchPageComponent {
  private readonly api = inject(MovieService);
  private readonly destroyRef = inject(DestroyRef);

  readonly queryControl = new FormControl<string>('', { nonNullable: true });

  private readonly _movies = signal<Movie[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _hasSearched = signal(false);

  readonly movies = computed(() => this._movies());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());
  readonly showEmpty = computed(() => this._hasSearched() && this._movies().length === 0);

  constructor() {
    this.queryControl.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        tap(() => {
          this._error.set(null);
        }),
        filter((q) => q.trim().length >= 2),
        tap(() => {
          this._hasSearched.set(true);
          this._loading.set(true);
        }),
        switchMap((q) => this.api.searchMovies(q.trim(), 1)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res) => {
          this._movies.set(res.results ?? []);
          this._loading.set(false);
        },
        error: (err: unknown) => {
          this._error.set(err instanceof Error ? err.message : 'Search failed');
          this._loading.set(false);
        }
      });
  }

  trackById(_: number, m: Movie): number {
    return m.id;
  }
}

