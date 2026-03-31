import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect } from 'vitest';

import { MovieFavoritesPageComponent } from './movie-favorites-page.component';
import { FavoritesService } from '../data-access/services/favorites.service';

describe('MovieFavoritesPageComponent', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [MovieFavoritesPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: FavoritesService,
          useValue: {
            favorites: signal([])
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(MovieFavoritesPageComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});

