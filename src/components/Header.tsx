import { useLocation } from 'react-router-dom';
import styles from "./header.module.css";

type HeaderProps = {
  query: string,
  setQuery: (query: string) => void
}

const Header = ({ query, setQuery }: HeaderProps) => {
  const location = useLocation();

  const getPlaceholder = () => {
    if (location.pathname.includes('/items')) {
      return 'Buscar items...';
    } else if (location.pathname.includes('/map')) {
      return 'Buscar ubicación...';
    } else {
      return 'Buscar Pokémon...';
    }
  };

  const getTitle = () => {
    if (location.pathname.includes('/items')) {
      return 'Items Pokémon';
    } else if (location.pathname.includes('/map')) {
      return 'Mapa Pokémon';
    } else {
      return 'Pokédex';
    }
  };

  const showSearch = !location.pathname.includes('/map');

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>{getTitle()}</h1>
        {showSearch && (
          <div className={styles.searchContainer}>
            <input 
              className={styles.input} 
              placeholder={getPlaceholder()} 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;