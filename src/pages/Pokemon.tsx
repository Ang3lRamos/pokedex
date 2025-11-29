import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPokemon, fetchPokemonSpecies } from '../api/pokeapi';
import { PokemonDetails, PokemonSpecies } from '../types/types';
import LoadingScreen from '../components/LoadingScreen';
import styles from './pokemon.module.css';

const Pokemon = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (name) {
      loadPokemon(name);
    }
  }, [name]);

  const loadPokemon = async (pokemonName: string) => {
    try {
      setLoading(true);
      const pokemonData = await fetchPokemon(pokemonName);
      setPokemon(pokemonData);

      const speciesData = await fetchPokemonSpecies(pokemonData.id);
      setSpecies(speciesData);
    } catch (error) {
      console.error('Error loading pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return colors[type] || '#A8A878';
  };

  const getStatColor = (value: number): string => {
    if (value < 50) return '#F34444';
    if (value < 80) return '#FFD700';
    return '#00C851';
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!pokemon) {
    return (
      <div className={styles.error}>
        <p>Pokémon no encontrado</p>
        <button onClick={() => navigate('/pokemons')}>Volver</button>
      </div>
    );
  }

  const primaryType = pokemon.types?.[0] || 'normal';

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate('/pokemons')}>
        ← Volver
      </button>

      <div 
        className={styles.header}
        style={{
          background: `linear-gradient(135deg, ${getTypeColor(primaryType)}dd, ${getTypeColor(primaryType)}99)`
        }}
      >
        <div className={styles.headerInfo}>
          <span className={styles.id}>#{String(pokemon.id).padStart(3, '0')}</span>
          <h1 className={styles.name}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </h1>
          <div className={styles.types}>
            {pokemon.types && pokemon.types.map((type) => (
              <span
                key={type}
                className={styles.type}
                style={{ backgroundColor: getTypeColor(type) }}
              >
                {type.toUpperCase()}
              </span>
            ))}
          </div>
          {species?.genera && (
            <p className={styles.genera}>{species.genera}</p>
          )}
        </div>
        <img 
          src={pokemon.imgSrc} 
          alt={pokemon.name}
          className={styles.mainImage}
        />
      </div>

      {species?.description && (
        <section className={styles.section}>
          <h2>Descripción</h2>
          <p className={styles.description}>{species.description}</p>
          {species.isLegendary && (
            <span className={styles.badge}>✨ Legendario</span>
          )}
          {species.isMythical && (
            <span className={styles.badge}>🌟 Mítico</span>
          )}
        </section>
      )}

      <section className={styles.section}>
        <h2>Información</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Altura</span>
            <span className={styles.value}>{pokemon.height} m</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Peso</span>
            <span className={styles.value}>{pokemon.weight} kg</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Hábitat</span>
            <span className={styles.value}>{species?.habitat || 'Desconocido'}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Habilidades</h2>
        <div className={styles.abilities}>
          {pokemon.abilities.map((ability) => (
            <span key={ability} className={styles.ability}>
              {ability.replace('-', ' ')}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Estadísticas Base</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statName}>HP</span>
            <div className={styles.statBar}>
              <div 
                className={styles.statFill}
                style={{ 
                  width: `${(pokemon.hp / 255) * 100}%`,
                  backgroundColor: getStatColor(pokemon.hp)
                }}
              />
            </div>
            <span className={styles.statValue}>{pokemon.hp}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statName}>Ataque</span>
            <div className={styles.statBar}>
              <div 
                className={styles.statFill}
                style={{ 
                  width: `${(pokemon.attack / 255) * 100}%`,
                  backgroundColor: getStatColor(pokemon.attack)
                }}
              />
            </div>
            <span className={styles.statValue}>{pokemon.attack}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statName}>Defensa</span>
            <div className={styles.statBar}>
              <div 
                className={styles.statFill}
                style={{ 
                  width: `${(pokemon.defense / 255) * 100}%`,
                  backgroundColor: getStatColor(pokemon.defense)
                }}
              />
            </div>
            <span className={styles.statValue}>{pokemon.defense}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statName}>Ataque Esp.</span>
            <div className={styles.statBar}>
              <div 
                className={styles.statFill}
                style={{ 
                  width: `${(pokemon.specialAttack / 255) * 100}%`,
                  backgroundColor: getStatColor(pokemon.specialAttack)
                }}
              />
            </div>
            <span className={styles.statValue}>{pokemon.specialAttack}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statName}>Defensa Esp.</span>
            <div className={styles.statBar}>
              <div 
                className={styles.statFill}
                style={{ 
                  width: `${(pokemon.specialDefense / 255) * 100}%`,
                  backgroundColor: getStatColor(pokemon.specialDefense)
                }}
              />
            </div>
            <span className={styles.statValue}>{pokemon.specialDefense}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statName}>Velocidad</span>
            <div className={styles.statBar}>
              <div 
                className={styles.statFill}
                style={{ 
                  width: `${(pokemon.speed / 255) * 100}%`,
                  backgroundColor: getStatColor(pokemon.speed)
                }}
              />
            </div>
            <span className={styles.statValue}>{pokemon.speed}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Sprites</h2>
        <div className={styles.sprites}>
          <img src={pokemon.sprites.front_default} alt="front" />
          <img src={pokemon.sprites.back_default} alt="back" />
          <img src={pokemon.sprites.front_shiny} alt="shiny front" />
          <img src={pokemon.sprites.back_shiny} alt="shiny back" />
        </div>
      </section>
    </div>
  );
};

export default Pokemon;