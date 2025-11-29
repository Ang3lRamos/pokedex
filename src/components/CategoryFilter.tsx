import styles from './categoryFilter.module.css';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const categories = [
    { name: 'all', label: 'Todos', color: '#777' },
    { name: 'stat-boosts', label: 'Potenciadores', color: '#FF6B6B' },
    { name: 'medicine', label: 'Medicina', color: '#4ECDC4' },
    { name: 'poke-balls', label: 'Poké Balls', color: '#F08030' },
    { name: 'type-enhancement', label: 'Mejora de Tipo', color: '#A890F0' },
    { name: 'collectibles', label: 'Coleccionables', color: '#FFD700' },
    { name: 'evolution', label: 'Evolución', color: '#78C850' },
    { name: 'spelunking', label: 'Exploración', color: '#C0C0C0' },
    { name: 'held-items', label: 'Objetos Equipables', color: '#F85888' },
    { name: 'choice', label: 'Elección', color: '#705898' },
    { name: 'effort-drop', label: 'EVs', color: '#F8D030' },
    { name: 'bad-held-items', label: 'Malos Equipables', color: '#A040A0' },
    { name: 'training', label: 'Entrenamiento', color: '#C03028' },
    { name: 'plates', label: 'Tablas', color: '#B8A038' },
    { name: 'species-specific', label: 'Específicos', color: '#7038F8' },
    { name: 'type-protection', label: 'Protección', color: '#98D8D8' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.filterScroll}>
        {categories.map((category) => (
          <button
            key={category.name}
            className={`${styles.categoryButton} ${
              selectedCategory === category.name ? styles.active : ''
            }`}
            style={{
              backgroundColor: selectedCategory === category.name ? category.color : '#fff',
              color: selectedCategory === category.name ? '#fff' : category.color,
              borderColor: category.color
            }}
            onClick={() => onCategoryChange(category.name)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;