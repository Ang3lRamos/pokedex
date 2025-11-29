import { useEffect, useState } from 'react';
import { fetchPokemons, searchPokemon, fetchPokemonsByType } from '../api/pokeapi';
import { Pokemon } from '../types/types';
import { Header, Footer, LoadingScreen } from './index';
import PokemonCard from '../components/PokemonCard';
import TypeFilter from '../components/TypeFilter';
import ScrollToTop from '../components/ScrollToTop';
import styles from './pokemons.module.css';

const Pokemons = () => {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [displayedPokemons, setDisplayedPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [displayCount, setDisplayCount] = useState(50);
  const LOAD_MORE_COUNT = 50;

  useEffect(() => {
    loadAllPokemons();
  }, []);

  useEffect(() => {
    if (query) {
      handleSearch();
    } else if (selectedType !== 'all') {
      handleTypeFilter(selectedType);
    } else {
      setFilteredPokemons(allPokemons);
    }
  }, [query, allPokemons, selectedType]);

  useEffect(() => {
    setDisplayedPokemons(filteredPokemons.slice(0, displayCount));
  }, [filteredPokemons, displayCount]);

  const loadAllPokemons = async () => {
    try {
      setLoading(true);
      // La API tiene actualmente más de 1000 Pokémon
      const data = await fetchPokemons(10000, 0);
      setAllPokemons(data);
      setFilteredPokemons(data);
    } catch (error) {
      console.error('Error loading pokemons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setFilteredPokemons(allPokemons);
      setDisplayCount(50);
      return;
    }

    const results = allPokemons.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.id.toString() === query
    );
    setFilteredPokemons(results);
    setDisplayCount(50);
  };

  const handleTypeFilter = async (type: string) => {
    setSelectedType(type);
    setQuery('');
    setDisplayCount(10000); // Mostrar todos cuando se filtra por tipo

    if (type === 'all') {
      setFilteredPokemons(allPokemons);
      setDisplayCount(50); // Volver a 50 cuando es "todos"
      return;
    }

    try {
      setLoading(true);
      const results = await fetchPokemonsByType(type);
      setFilteredPokemons(results);
    } catch (error) {
      console.error('Error filtering by type:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + LOAD_MORE_COUNT);
  };

  if (loading && allPokemons.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ScrollToTop />
      <Header query={query} setQuery={setQuery} />
      
      <TypeFilter 
        selectedType={selectedType} 
        onTypeChange={handleTypeFilter} 
      />

      <main className={styles.container}>
        {loading ? (
          <div className={styles.loadingText}>Cargando...</div>
        ) : filteredPokemons.length === 0 ? (
          <div className={styles.noResults}>
            <p>No se encontraron Pokémon</p>
          </div>
        ) : (
          <>
            <div className={styles.statsInfo}>
              Mostrando {displayedPokemons.length} de {filteredPokemons.length} Pokémon
              {selectedType === 'all' && !query && (
                <span className={styles.totalCount}> (Total disponibles: {allPokemons.length})</span>
              )}
            </div>

            <div className={styles.grid}>
              {displayedPokemons.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>

            {displayedPokemons.length < filteredPokemons.length && (
              <div className={styles.loadMoreContainer}>
                <button
                  onClick={handleLoadMore}
                  className={styles.loadMoreButton}
                >
                  Cargar más Pokémon ({filteredPokemons.length - displayedPokemons.length} restantes)
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Pokemons;