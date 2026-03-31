import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [StorageService] });
    service = TestBed.inject(StorageService);
  });

  it('set/get/remove works', () => {
    service.set('k', { v: 1 });
    expect(service.get<{ v: number }>('k')?.v).toBe(1);

    service.remove('k');
    expect(service.get('k')).toBe(null);
  });
});

