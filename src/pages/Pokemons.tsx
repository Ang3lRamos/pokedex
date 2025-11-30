import { useEffect, useState, useCallback } from 'react';
import { fetchPokemons, fetchPokemonsByType } from '../api/pokeapi';
import { Pokemon } from '../types/types';
import { Header, Footer, LoadingScreen } from './index';
import PokemonCard from '../components/PokemonCard';
import TypeFilter from '../components/TypeFilter';
import ScrollToTop from '../components/ScrollToTop';
import ScrollProgressBar from '../components/ScrollProgressBar';
import styles from './pokemons.module.css';

const Pokemons = () => {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    loadAllPokemons();
  }, []);

  const handleSearch = useCallback(() => {
    if (!query.trim()) {
      setFilteredPokemons(allPokemons);
      return;
    }

    const results = allPokemons.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.id.toString() === query
    );
    setFilteredPokemons(results);
  }, [query, allPokemons]);

  const handleTypeFilter = useCallback(async (type: string) => {
    setSelectedType(type);
    setQuery('');

    if (type === 'all') {
      setFilteredPokemons(allPokemons);
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
  }, [allPokemons]);

  useEffect(() => {
    if (query) {
      handleSearch();
    } else if (selectedType !== 'all') {
      handleTypeFilter(selectedType);
    } else {
      setFilteredPokemons(allPokemons);
    }
  }, [query, allPokemons, selectedType, handleSearch, handleTypeFilter]);

  const loadAllPokemons = async () => {
    try {
      setLoading(true);
      const data = await fetchPokemons(10000, 0);
      setAllPokemons(data);
      setFilteredPokemons(data);
    } catch (error) {
      console.error('Error loading pokemons:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && allPokemons.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ScrollToTop />
      <ScrollProgressBar />
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
              Mostrando {filteredPokemons.length} Pokémon
              {selectedType === 'all' && !query && (
                <span className={styles.totalCount}> (Total: {allPokemons.length})</span>
              )}
            </div>

            <div className={styles.grid}>
              {filteredPokemons.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Pokemons;