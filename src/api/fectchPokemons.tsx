//https://unpkg.com/pokemons@1.1.0/pokemons.json

import { Pokemon } from "../types/types";
import { formatPokemonName } from "../utils/Utils";

export async function fetchPokemons(): Promise<Pokemon[]> {
  const response = await fetch(
    "https://unpkg.com/pokemons@1.1.0/pokemons.json"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch pokemons");
  }

  const results = await response.json();
  const pokemons = results.results.map((pokemon: any) => ({
    name: pokemon.name,
    id: pokemon.national_number,
    imgSrc: `https://img.pokemondb.net/sprites/black-white/anim/normal/${formatPokemonName(
      pokemon.name.toLowerCase()
    )}.gif`
  }));

  const uniquePokemons: Pokemon[] = [];
  const uniqueIds: Set<number> = new Set();

  for (const pokemon of pokemons) {
    if (!uniqueIds.has(pokemon.id)) {
      uniquePokemons.push(pokemon);
      uniqueIds.add(pokemon.id);
    }
  }

  return uniquePokemons;
}


