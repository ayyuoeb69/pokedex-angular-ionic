import { inject, Injectable } from '@angular/core';
import { PokeApiListResponse, PokeApiPokemon, PokeApiTypeResponse } from '../models/pokeapi.type';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { listToItem } from '../utils/helper';
import { Pokemon, PokemonListItem, PokemonPage } from '../models/pokemon.type';
import { shareReplay } from 'rxjs/internal/operators/shareReplay';
import { mapPokemon } from '../utils/mapper';

const BASE_URL = 'https://pokeapi.co/api/v2';

@Injectable({
  providedIn: 'root',
})
export class PokeapiService {
  private readonly http = inject(HttpClient);
  protected readonly pageCache = new Map<string, Observable<PokemonPage>>();
  protected readonly typeFilterCache = new Map<string, Observable<PokemonListItem[]>>();
  protected readonly detailCache = new Map<number, Observable<Pokemon>>();

  getPokemonList(offset: number, limit: number): Observable<PokemonPage> {
    const key = `${offset}:${limit}`;
    const cached = this.pageCache.get(key);
    if (cached) {
      return cached;
    }

    const response = this.http
      .get<PokeApiListResponse>(`${BASE_URL}/pokemon`, {
        params: { offset, limit },
      })
      .pipe(
        map((data) => ({
          items: data.results.map((item) => listToItem(item.name, item.url)),
          total: data.count,
          hasMore: data.next !== null,
        })),
        shareReplay({ bufferSize: 1, refCount: false }),
        catchError((error) => this.evict(this.pageCache, key, error)),
      );
    this.pageCache.set(key, response);
    return response;
  }

  getPokemonDetail(id: number): Observable<Pokemon> {
    const cached = this.detailCache.get(id);
    if (cached) {
      return cached;
    }

    const response = this.http.get<PokeApiPokemon>(`${BASE_URL}/pokemon/${id}`).pipe(
      map(mapPokemon),
      shareReplay({ bufferSize: 1, refCount: false }),
      catchError((error) => this.evict(this.detailCache, id, error)),
    );
    this.detailCache.set(id, response);
    return response;
  }

  getFilteredPokemonList(type: string): Observable<PokemonListItem[]> {
    const key = `type:${type}`;
    const cached = this.typeFilterCache.get(key);
    if (cached) {
      return cached;
    }

    const response = this.http.get<PokeApiTypeResponse>(`${BASE_URL}/type/${type}`).pipe(
      map((data) => data.pokemon.map((item) => listToItem(item.pokemon.name, item.pokemon.url))),
      shareReplay({ bufferSize: 1, refCount: false }),
      catchError((error) => this.evict(this.typeFilterCache, key, error)),
    );
    this.typeFilterCache.set(key, response);
    return response;
  }

  private evict<K>(cache: Map<K, unknown>, key: K, error: unknown): Observable<never> {
    cache.delete(key);
    return throwError(() => error);
  }
}
