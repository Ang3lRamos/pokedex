// src/pages/Items.tsx
import { useEffect, useState } from 'react';
import { fetchItems, fetchItemsByCategory, searchItems, Item } from '../api/items-locations';
import { Header, Footer, LoadingScreen, ScrollToTop, ScrollProgressBar } from './index';
import ItemCard from '../components/ItemCard';
import CategoryFilter from '../components/CategoryFilter';
import styles from './items.module.css';

const Items = () => {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [displayCount, setDisplayCount] = useState(50);
  const LOAD_MORE_COUNT = 50;

  useEffect(() => {
    loadAllItems();
  }, []);

  useEffect(() => {
    if (query) {
      handleSearch();
    } else if (selectedCategory !== 'all') {
      handleCategoryFilter(selectedCategory);
    } else {
      setFilteredItems(allItems);
    }
  }, [query, allItems, selectedCategory]);

  useEffect(() => {
    setDisplayedItems(filteredItems.slice(0, displayCount));
  }, [filteredItems, displayCount]);

  const loadAllItems = async () => {
    try {
      setLoading(true);
      const data = await fetchItems(1000, 0);
      setAllItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!query.trim()) {
      setFilteredItems(allItems);
      setDisplayCount(50);
      return;
    }

    const results = searchItems(query, allItems);
    setFilteredItems(results);
    setDisplayCount(50);
  };

  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    setQuery('');
    setDisplayCount(10000);

    if (category === 'all') {
      setFilteredItems(allItems);
      setDisplayCount(50);
      return;
    }

    try {
      setLoading(true);
      const results = await fetchItemsByCategory(category);
      setFilteredItems(results);
    } catch (error) {
      console.error('Error filtering by category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + LOAD_MORE_COUNT);
  };

  if (loading && allItems.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ScrollProgressBar />
      <ScrollToTop />
      <Header query={query} setQuery={setQuery} />
      
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onCategoryChange={handleCategoryFilter} 
      />

      <main className={styles.container}>
        {loading ? (
          <div className={styles.loadingText}>Cargando...</div>
        ) : filteredItems.length === 0 ? (
          <div className={styles.noResults}>
            <p>No se encontraron items</p>
          </div>
        ) : (
          <>
            <div className={styles.statsInfo}>
              Mostrando {displayedItems.length} de {filteredItems.length} items
              {selectedCategory === 'all' && !query && (
                <span className={styles.totalCount}> (Total disponibles: {allItems.length})</span>
              )}
            </div>

            <div className={styles.grid}>
              {displayedItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>

            {displayedItems.length < filteredItems.length && (
              <div className={styles.loadMoreContainer}>
                <button
                  onClick={handleLoadMore}
                  className={styles.loadMoreButton}
                >
                  Cargar más items ({filteredItems.length - displayedItems.length} restantes)
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

export default Items;