import { useRef } from 'react';
import styles from './typeFilter.module.css';

interface TypeFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const TypeFilter = ({ selectedType, onTypeChange }: TypeFilterProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const types = [
    { name: 'all', label: 'Todos', color: '#777' },
    { name: 'normal', label: 'Normal', color: '#A8A878' },
    { name: 'fire', label: 'Fuego', color: '#F08030' },
    { name: 'water', label: 'Agua', color: '#6890F0' },
    { name: 'electric', label: 'Eléctrico', color: '#F8D030' },
    { name: 'grass', label: 'Planta', color: '#78C850' },
    { name: 'ice', label: 'Hielo', color: '#98D8D8' },
    { name: 'fighting', label: 'Lucha', color: '#C03028' },
    { name: 'poison', label: 'Veneno', color: '#A040A0' },
    { name: 'ground', label: 'Tierra', color: '#E0C068' },
    { name: 'flying', label: 'Volador', color: '#A890F0' },
    { name: 'psychic', label: 'Psíquico', color: '#F85888' },
    { name: 'bug', label: 'Bicho', color: '#A8B820' },
    { name: 'rock', label: 'Roca', color: '#B8A038' },
    { name: 'ghost', label: 'Fantasma', color: '#705898' },
    { name: 'dragon', label: 'Dragón', color: '#7038F8' },
    { name: 'dark', label: 'Siniestro', color: '#705848' },
    { name: 'steel', label: 'Acero', color: '#B8B8D0' },
    { name: 'fairy', label: 'Hada', color: '#EE99AC' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.filterScroll} ref={scrollRef}>
        {types.map((type) => (
          <button
            key={type.name}
            className={`${styles.typeButton} ${
              selectedType === type.name ? styles.active : ''
            }`}
            style={{
              backgroundColor: selectedType === type.name ? type.color : '#fff',
              color: selectedType === type.name ? '#fff' : type.color,
              borderColor: type.color
            }}
            onClick={() => onTypeChange(type.name)}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;