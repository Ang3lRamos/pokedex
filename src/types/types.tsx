export interface Pokemon {
  name: string;
  id: number;
  imgSrc: string;
  gifSrc?: string;
  types?: string[];
}

export interface PokemonDetails extends Pokemon {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  weight: number;
  height: number;
  abilities: string[];
  sprites: {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
  };
}

export interface PokemonSpecies {
  description: string;
  evolutionChainUrl: string;
  genera: string;
  habitat: string;
  isLegendary: boolean;
  isMythical: boolean;
}

export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';