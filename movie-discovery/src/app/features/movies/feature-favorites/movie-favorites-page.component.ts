import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FavoritesService } from '../data-access/services/favorites.service';
import { EmptyStateComponent } from '@shared/ui/empty-state/empty-state.component';
import { MovieCardComponent } from '../ui/movie-card/movie-card.component';

@Component({
  selector: 'app-movie-favorites-page',
  standalone: true,
  imports: [CommonModule, RouterLink, EmptyStateComponent, MovieCardComponent],
  template: `
    <section class="page">
      <header class="page__header">
        <h2 class="page__title">Избранное</h2>
        <p class="page__subtitle">Фильмы, которые ты сохранил(а).</p>
      </header>

      <app-empty-state
        *ngIf="favorites().length === 0"
        title="Избранное пустое"
        subtitle="Добавь фильмы сердечком в поиске или на странице фильма."
      />

      <div class="grid" *ngIf="favorites().length">
        <a
          class="grid__item"
          *ngFor="let m of favorites(); trackBy: trackById"
          [routerLink]="['/movie', m.id]"
        >
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
export class MovieFavoritesPageComponent {
  private readonly fav = inject(FavoritesService);
  readonly favorites = computed(() => this.fav.favorites());

  trackById(_: number, m: { id: number }): number {
    return m.id;
  }
}

