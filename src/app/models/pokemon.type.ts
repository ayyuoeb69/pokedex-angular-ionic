export enum ListModeEnum {
  BROWSE = 'browse',
  FILTER = 'filter',
}

export enum PokemonTypeEnum {
  ALL = 'all',
  NORMAL = 'normal',
  FIGHTING = 'fighting',
  FLYING = 'flying',
  POISON = 'poison',
  GROUND = 'ground',
  ROCK = 'rock',
  BUG = 'bug',
  GHOST = 'ghost',
  STEEL = 'steel',
  FIRE = 'fire',
  WATER = 'water',
  GRASS = 'grass',
  ELECTRIC = 'electric',
  PSYCHIC = 'psychic',
  ICE = 'ice',
  DRAGON = 'dragon',
  DARK = 'dark',
  FAIRY = 'fairy',
}

export interface PokemonListItem {
  id: number;
  name: string;
  imageUrl: string | null;
}

export interface PokemonPage {
  items: PokemonListItem[];
  total: number;
  hasMore: boolean;
}

export type ListMode = ListModeEnum.BROWSE | ListModeEnum.FILTER;
export type PokemonType = (typeof PokemonTypeEnum)[keyof typeof PokemonTypeEnum];

export interface BatchPokemon {
  items: PokemonListItem[];
  length: number;
  hasMore: boolean;
}

export interface FavoritePokemon {
  id: number;
  name: string;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: PokemonType[];
  heightM: number;
  weightKg: number;
  stats: PokemonStat[];
}
