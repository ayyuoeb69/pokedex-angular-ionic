import { computed, inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { FavoritePokemon, PokemonListItem } from '../models/pokemon.type';
import { artworkUrl } from '../utils/helper';

const STORAGE_KEY = 'favorites';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly storage = inject(StorageService);

  private readonly _favorites = signal<FavoritePokemon[]>([]);
  readonly favorites = this._favorites.asReadonly();

  private readonly favoriteIds = computed(
    () => new Set(this._favorites().map((favorite) => favorite.id)),
  );

  readonly count = computed(() => this._favorites().length);
  readonly isEmpty = computed(() => this._favorites().length === 0);

  readonly items = computed<PokemonListItem[]>(() =>
    this._favorites().map((favorite) => ({
      id: favorite.id,
      name: favorite.name,
      imageUrl: artworkUrl(favorite.id),
    })),
  );

  async init(): Promise<void> {
    const stored = await this.storage.get<FavoritePokemon[]>(STORAGE_KEY);
    if (Array.isArray(stored)) {
      this._favorites.set(stored.filter(isGuardedFavoritePokemon));
    }
  }

  isFavorite(id: number): boolean {
    return this.favoriteIds().has(id);
  }

  async toggle(pokemon: FavoritePokemon): Promise<void> {
    const isCurrentlyFavorite = this.isFavorite(pokemon.id);

    this._favorites.update((current) =>
      isCurrentlyFavorite
        ? current.filter((favorite) => favorite.id !== pokemon.id)
        : [{ id: pokemon.id, name: pokemon.name }, ...current],
    );

    await this.persist();
  }

  private persist(): Promise<void> {
    return this.storage.set(STORAGE_KEY, this._favorites());
  }
}

const isGuardedFavoritePokemon = (value: unknown): value is FavoritePokemon =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as FavoritePokemon).id === 'number' &&
  typeof (value as FavoritePokemon).name === 'string';
