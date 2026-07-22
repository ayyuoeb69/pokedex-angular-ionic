import { PokemonListItem, PokemonType, PokemonTypeEnum } from '../models/pokemon.type';
import { PokemonTypeColor } from './mapper';

export const idFromUrl = (url: string): number => Number(url.split('/').filter(Boolean).pop());

export const artworkUrl = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const listToItem = (name: string, url: string): PokemonListItem => {
  const id = idFromUrl(url);
  return { id, name, imageUrl: artworkUrl(id) };
};

export const formatStatName = (raw: string): string =>
  raw
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const isPokemonTypeName = (value: PokemonTypeEnum): boolean =>
  Object.values(PokemonTypeEnum).includes(value);

export const colorPokemonType = (type: PokemonType): string => PokemonTypeColor[type];

export const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (img.src.endsWith('pokeball.svg')) return;
  img.src = 'pokeball.svg';
};
