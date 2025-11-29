import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pokemon } from '../types/types';
import styles from './pokemonCard.module.css';

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

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

  const primaryType = pokemon.types?.[0] || 'normal';
  const gradientColor = getTypeColor(primaryType);

  return (
    <Link 
      to={`/pokemons/${pokemon.name}`} 
      className={styles.card}
      style={{
        background: `linear-gradient(135deg, ${gradientColor}dd, ${gradientColor}99)`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.idBadge}>
        #{String(pokemon.id).padStart(3, '0')}
      </div>

      <div className={styles.imageContainer}>
        <img 
          src={isHovered && pokemon.gifSrc ? pokemon.gifSrc : pokemon.imgSrc}
          alt={pokemon.name}
          className={styles.image}
          loading="lazy"
        />
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </h3>

        {pokemon.types && (
          <div className={styles.types}>
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={styles.type}
                style={{ backgroundColor: getTypeColor(type) }}
              >
                {type.toUpperCase()}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default PokemonCard;