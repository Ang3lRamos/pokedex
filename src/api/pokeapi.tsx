import { Pokemon, PokemonDetails, PokemonSpecies } from "../types/types";

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemons(limit: number = 151, offset: number = 0): Promise<Pokemon[]> {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch pokemons");
    }

    const data = await response.json();
    
    // Obtener detalles básicos de cada pokemon con mejor manejo de errores
    const pokemonPromises = data.results.map(async (result: any) => {
      try {
        const pokemonResponse = await fetch(result.url);
        if (!pokemonResponse.ok) {
          throw new Error(`Failed to fetch ${result.name}`);
        }
        const pokemonData = await pokemonResponse.json();
        
        // Múltiples fuentes de imagen con prioridad
        const officialArtwork = pokemonData.sprites.other?.['official-artwork']?.front_default;
        const dreamWorld = pokemonData.sprites.other?.dream_world?.front_default;
        const homeFront = pokemonData.sprites.other?.home?.front_default;
        const defaultSprite = pokemonData.sprites.front_default;
        const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png`;
        
        return {
          name: pokemonData.name,
          id: pokemonData.id,
          imgSrc: officialArtwork || dreamWorld || homeFront || defaultSprite || fallbackUrl,
          gifSrc: pokemonData.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default ||
                  pokemonData.sprites.front_default ||
                  fallbackUrl,
          types: pokemonData.types.map((t: any) => t.type.name)
        };
      } catch (error) {
        console.error(`Error fetching ${result.name}:`, error);
        // Retornar un pokemon básico si falla
        const id = parseInt(result.url.split('/').filter(Boolean).pop() || '0');
        return {
          name: result.name,
          id: id,
          imgSrc: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          gifSrc: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          types: ['normal']
        };
      }
    });

    const pokemons = await Promise.all(pokemonPromises);
    return pokemons;
  } catch (error) {
    console.error('Error fetching pokemons:', error);
    throw error;
  }
}

export async function fetchPokemon(nameOrId: string | number): Promise<PokemonDetails> {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);

    if (!response.ok) {
      throw new Error(`Error fetching ${nameOrId}`);
    }

    const result = await response.json();

    const pokemon: PokemonDetails = {
      name: result.name,
      id: result.id,
      imgSrc: result.sprites.other['official-artwork'].front_default || 
              result.sprites.front_default,
      hp: result.stats[0].base_stat,
      attack: result.stats[1].base_stat,
      defense: result.stats[2].base_stat,
      specialAttack: result.stats[3].base_stat,
      specialDefense: result.stats[4].base_stat,
      speed: result.stats[5].base_stat,
      types: result.types.map((t: any) => t.type.name),
      weight: result.weight / 10, // convertir a kg
      height: result.height / 10, // convertir a m
      abilities: result.abilities.map((a: any) => a.ability.name),
      sprites: {
        front_default: result.sprites.front_default,
        back_default: result.sprites.back_default,
        front_shiny: result.sprites.front_shiny,
        back_shiny: result.sprites.back_shiny,
      }
    };

    return pokemon;
  } catch (error) {
    console.error(`Error fetching pokemon ${nameOrId}:`, error);
    throw error;
  }
}

export async function fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
  try {
    const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);

    if (!response.ok) {
      throw new Error(`Error fetching species ${id}`);
    }

    const result = await response.json();

    // Buscar descripción en español
    const spanishEntry = result.flavor_text_entries.find(
      (entry: any) => entry.language.name === 'es'
    );

    const species: PokemonSpecies = {
      description: spanishEntry 
        ? spanishEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
        : result.flavor_text_entries[0]?.flavor_text || 'Sin descripción',
      evolutionChainUrl: result.evolution_chain.url,
      genera: result.genera.find((g: any) => g.language.name === 'es')?.genus || '',
      habitat: result.habitat?.name || 'unknown',
      isLegendary: result.is_legendary,
      isMythical: result.is_mythical
    };

    return species;
  } catch (error) {
    console.error(`Error fetching species ${id}:`, error);
    throw error;
  }
}

export async function searchPokemon(query: string): Promise<Pokemon[]> {
  try {
    // Intenta buscar por nombre exacto primero
    try {
      const pokemon = await fetchPokemon(query.toLowerCase());
      return [{
        name: pokemon.name,
        id: pokemon.id,
        imgSrc: pokemon.imgSrc,
        types: pokemon.types
      }];
    } catch {
      // Si no encuentra por nombre exacto, buscar en la lista completa
      const allPokemons = await fetchPokemons(1000, 0);
      return allPokemons.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  } catch (error) {
    console.error('Error searching pokemon:', error);
    return [];
  }
}

export async function fetchPokemonsByType(type: string): Promise<Pokemon[]> {
  try {
    const response = await fetch(`${BASE_URL}/type/${type}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching type ${type}`);
    }

    const data = await response.json();
    
    const pokemonPromises = data.pokemon.map(async (p: any) => {
      try {
        const pokemonData = await fetch(p.pokemon.url).then(r => r.json());
        
        const officialArtwork = pokemonData.sprites.other?.['official-artwork']?.front_default;
        const dreamWorld = pokemonData.sprites.other?.dream_world?.front_default;
        const homeFront = pokemonData.sprites.other?.home?.front_default;
        const defaultSprite = pokemonData.sprites.front_default;
        const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png`;
        
        return {
          name: pokemonData.name,
          id: pokemonData.id,
          imgSrc: officialArtwork || dreamWorld || homeFront || defaultSprite || fallbackUrl,
          gifSrc: pokemonData.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default ||
                  pokemonData.sprites.front_default ||
                  fallbackUrl,
          types: pokemonData.types.map((t: any) => t.type.name)
        };
      } catch (error) {
        console.error(`Error fetching pokemon from type:`, error);
        return null;
      }
    });

    const results = await Promise.all(pokemonPromises);
    return results.filter((p): p is Pokemon => p !== null);
  } catch (error) {
    console.error(`Error fetching pokemons by type ${type}:`, error);
    throw error;
  }
}