import { PokeApiPokemon } from '../models/pokeapi.type';
import { Pokemon, PokemonStat, PokemonType, PokemonTypeEnum } from '../models/pokemon.type';
import { artworkUrl, formatStatName, isPokemonTypeName } from './helper';

export const PokemonTypeColor: Record<string, string> = {
  [PokemonTypeEnum.ALL]: '#8d9080',
  [PokemonTypeEnum.NORMAL]: '#A8A77A',
  [PokemonTypeEnum.FIRE]: '#EE8130',
  [PokemonTypeEnum.WATER]: '#6390F0',
  [PokemonTypeEnum.ELECTRIC]: '#F7D02C',
  [PokemonTypeEnum.GRASS]: '#7AC74C',
  [PokemonTypeEnum.ICE]: '#96D9D6',
  [PokemonTypeEnum.FIGHTING]: '#C22E28',
  [PokemonTypeEnum.POISON]: '#A33EA1',
  [PokemonTypeEnum.GROUND]: '#E2BF65',
  [PokemonTypeEnum.FLYING]: '#A98FF3',
  [PokemonTypeEnum.PSYCHIC]: '#F95587',
  [PokemonTypeEnum.BUG]: '#A6B91A',
  [PokemonTypeEnum.ROCK]: '#B6A136',
  [PokemonTypeEnum.GHOST]: '#735797',
  [PokemonTypeEnum.DRAGON]: '#6F35FC',
  [PokemonTypeEnum.DARK]: '#705746',
  [PokemonTypeEnum.STEEL]: '#B7B7CE',
  [PokemonTypeEnum.FAIRY]: '#D685AD',
};

const mapTypes = (raw: PokeApiPokemon): PokemonType[] =>
  [...raw.types]
    .sort((a, b) => a.slot - b.slot)
    .map((entry) => entry.type.name)
    .filter(isPokemonTypeName);

const mapStats = (raw: PokeApiPokemon): PokemonStat[] =>
  raw.stats.map((entry) => ({
    name: formatStatName(entry.stat.name),
    value: entry.base_stat,
  }));

const mapImageUrl = (raw: PokeApiPokemon): string =>
  raw.sprites.other?.['official-artwork']?.front_default ??
  raw.sprites.front_default ??
  artworkUrl(raw.id);

export const mapPokemon = (raw: PokeApiPokemon): Pokemon => ({
  id: raw.id,
  name: raw.name,
  imageUrl: mapImageUrl(raw),
  types: mapTypes(raw),
  heightM: raw.height / 10,
  weightKg: raw.weight / 10,
  stats: mapStats(raw),
});
