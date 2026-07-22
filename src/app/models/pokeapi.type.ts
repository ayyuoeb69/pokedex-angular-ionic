import { PokemonType } from './pokemon.type';

export interface PokeApiNamedResource {
  name: PokemonType;
  url: string;
}

export interface PokeApiListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeApiNamedResource[];
}

export interface PokeApiPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: PokeApiNamedResource }[];
  stats: { base_stat: number; stat: PokeApiNamedResource }[];
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: { front_default: string | null };
    };
  };
}

export interface PokeApiTypeResponse {
  pokemon: { slot: number; pokemon: PokeApiNamedResource }[];
}
