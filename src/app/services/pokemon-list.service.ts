import { inject, Injectable, signal } from '@angular/core';
import { PokeapiService } from './pokeapi.service';
import {
  BatchPokemon,
  ListMode,
  ListModeEnum,
  PokemonListItem,
  PokemonType,
  PokemonTypeEnum,
} from '../models/pokemon.type';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

const PAGE_SIZE = 30;

@Injectable({
  providedIn: 'root',
})
export class PokemonListService {
  private readonly api = inject(PokeapiService);

  private readonly _items = signal<PokemonListItem[]>([]);
  private readonly _loading = signal(false);
  private readonly _hasMore = signal(true);
  private readonly _mode = signal<ListMode>(ListModeEnum.BROWSE);
  private readonly _activeType = signal<PokemonType>(PokemonTypeEnum.ALL);
  private readonly _error = signal<string | null>(null);

  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly hasMore = this._hasMore.asReadonly();
  readonly mode = this._mode.asReadonly();
  readonly activeType = this._activeType.asReadonly();
  readonly error = this._error.asReadonly();

  private offset = 0;
  private dataPool: PokemonListItem[] = [];

  async init(): Promise<void> {
    if (this._items().length === 0 && !this._loading()) {
      await this.loadMore();
    }
  }

  async loadMore(): Promise<void> {
    if (this._loading() || !this._hasMore()) {
      return;
    }
    const activeTyped = this._activeType();
    this._loading.set(true);
    this._error.set(null);
    try {
      const batch =
        this._mode() === ListModeEnum.BROWSE
          ? await this.fetchPokemonList(this.offset, PAGE_SIZE)
          : this.loadNextFilter();
      if (this.isStale(activeTyped)) return;
      this._items.update((current) => [...current, ...batch.items]);
      this.offset += batch.length;
      this._hasMore.set(batch.hasMore);
    } catch (error) {
      if (this.isStale(activeTyped)) return;
      this._error.set('Could not load more Pokémon. Check your connection.');
      this._hasMore.set(false);
    } finally {
      this._loading.set(false);
    }
  }

  private async fetchPokemonList(offset: number, limit: number): Promise<BatchPokemon> {
    return await firstValueFrom(this.api.getPokemonList(offset, limit)).then((page) => {
      return {
        items: page.items,
        length: PAGE_SIZE,
        hasMore: page.hasMore,
      };
    });
  }

  async fetchFilteredPokemonList(type: PokemonType): Promise<boolean> {
    this._loading.set(true);

    try {
      const response = await firstValueFrom(this.api.getFilteredPokemonList(type));
      if (this.isStale(type)) return false;

      this.dataPool = response;
      this._hasMore.set(response.length > 0);
      return true;
    } catch (error) {
      if (this.isStale(type)) return false;
      this._error.set('Could not load that type. Check your connection.');
      this._hasMore.set(false);
      return false;
    } finally {
      this._loading.set(false);
    }
  }

  async selectType(type: PokemonType): Promise<void> {
    if (type === this._activeType()) return;

    this.reset();
    this._activeType.set(type);
    this._mode.set(type === PokemonTypeEnum.ALL ? ListModeEnum.BROWSE : ListModeEnum.FILTER);

    if (
      type !== null &&
      type !== PokemonTypeEnum.ALL &&
      !(await this.fetchFilteredPokemonList(type))
    )
      return;

    await this.loadMore();
  }

  async retry(): Promise<void> {
    this._error.set(null);
    this._hasMore.set(true);
    await this.loadMore();
  }

  private reset(): void {
    this.offset = 0;
    this.dataPool = [];
    this._items.set([]);
    this._loading.set(false);
    this._hasMore.set(true);
    this._error.set(null);
  }

  private loadNextFilter(): BatchPokemon {
    const dataFilter = this.dataPool.slice(this.offset, this.offset + PAGE_SIZE);
    return {
      items: dataFilter,
      length: PAGE_SIZE,
      hasMore: this.offset + dataFilter.length < this.dataPool.length,
    };
  }

  private isStale(type: PokemonType): boolean {
    return this._activeType() !== type;
  }
}
