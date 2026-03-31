import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { Movie } from '../data-access/models/movie.model';
import { movieResolver } from './movie.resolver';
import { EmptyStateComponent } from '@shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-movie-details-page',
  standalone: true,
  imports: [CommonModule, RouterLink, EmptyStateComponent],
  template: `
    <section class="page">
      <a class="back" routerLink="/search">← Назад к поиску</a>

      <ng-container *ngIf="movie() as m; else errorTpl">
        <div class="hero">
          <div class="poster" [class.poster--empty]="!m.poster_path">
            <img
              *ngIf="m.poster_path as p"
              class="poster__img"
              [src]="posterUrl(p)"
              [alt]="m.title"
            />
          </div>

          <div class="meta">
            <h1 class="title">{{ m.title }}</h1>
            <div class="sub">
              <span class="muted">{{ m.release_date || '—' }}</span>
              <span class="rating">★ {{ m.vote_average | number: '1.1-1' }}</span>
            </div>
            <p class="overview">{{ m.overview || 'Описание отсутствует.' }}</p>
          </div>
        </div>
      </ng-container>

      <ng-template #errorTpl>
        <app-empty-state title="Не удалось загрузить фильм" subtitle="Проверьте id и API-ключ." />
      </ng-template>
    </section>
  `,
  styles: [
    `
      .page {
        padding: 1rem 0 2rem;
      }
      .back {
        display: inline-block;
        margin-bottom: 1rem;
        text-decoration: none;
        color: var(--text-muted);
      }
      .back:hover {
        color: var(--text);
      }

      .hero {
        display: grid;
        grid-template-columns: 220px 1fr;
        gap: 1.25rem;
        align-items: start;
      }

      @media (max-width: 760px) {
        .hero {
          grid-template-columns: 1fr;
        }
      }

      .poster {
        width: 100%;
        aspect-ratio: 2 / 3;
        border-radius: 18px;
        overflow: hidden;
        border: 1px solid var(--border-subtle);
        background: rgba(255, 255, 255, 0.04);
      }
      .poster--empty {
        background: linear-gradient(135deg, rgba(255, 107, 107, 0.18), rgba(255, 195, 113, 0.12));
      }
      .poster__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .title {
        margin: 0 0 0.4rem;
      }
      .sub {
        display: flex;
        gap: 0.75rem;
        align-items: baseline;
        margin-bottom: 0.75rem;
      }
      .muted {
        color: var(--text-muted);
      }
      .rating {
        color: #ffc371;
      }
      .overview {
        margin: 0;
        line-height: 1.6;
        opacity: 0.9;
      }
    `
  ]
})
export class MovieDetailsPageComponent {
  static readonly resolver = movieResolver;

  private readonly route = inject(ActivatedRoute);

  readonly movie = toSignal<Movie | null>(
    this.route.paramMap.pipe(map(() => (this.route.snapshot.data['movie'] as Movie | undefined) ?? null)),
    { initialValue: null }
  );

  readonly hasMovie = computed(() => Boolean(this.movie()));

  posterUrl(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}

