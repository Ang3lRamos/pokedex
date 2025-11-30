import { useEffect, useState, useCallback } from 'react';
import { fetchItems, fetchItemsByCategory, searchItems, Item } from '../api/items-locations';
import { Header, Footer, LoadingScreen, ScrollToTop, ScrollProgressBar } from './index';
import ItemCard from '../components/ItemCard';
import CategoryFilter from '../components/CategoryFilter';
import styles from './items.module.css';

const Items = () => {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadAllItems();
  }, []);

  const handleSearch = useCallback(() => {
    if (!query.trim()) {
      setFilteredItems(allItems);
      return;
    }

    const results = searchItems(query, allItems);
    setFilteredItems(results);
  }, [query, allItems]);

  const handleCategoryFilter = useCallback(async (category: string) => {
    setSelectedCategory(category);
    setQuery('');

    if (category === 'all') {
      setFilteredItems(allItems);
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
  }, [allItems]);

  useEffect(() => {
    if (query) {
      handleSearch();
    } else if (selectedCategory !== 'all') {
      handleCategoryFilter(selectedCategory);
    } else {
      setFilteredItems(allItems);
    }
  }, [query, allItems, selectedCategory, handleSearch, handleCategoryFilter]);

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

  if (loading && allItems.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ScrollToTop />
      <ScrollProgressBar />
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
              Mostrando {filteredItems.length} items
              {selectedCategory === 'all' && !query && (
                <span className={styles.totalCount}> (Total: {allItems.length})</span>
              )}
            </div>

            <div className={styles.grid}>
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Items;