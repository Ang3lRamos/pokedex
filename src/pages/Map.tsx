// src/pages/Map.tsx
import { useEffect, useState } from 'react';
import { fetchRegions, fetchLocationsByRegion, Region, Location } from '../api/items-locations';
import { Header, Footer, LoadingScreen, ScrollToTop, ScrollProgressBar } from './index';
import RegionCard from '../components/RegionCard';
import LocationCard from '../components/LocationCard';
import styles from './map.module.css';

const Map = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    try {
      setLoading(true);
      const data = await fetchRegions();
      // Filtrar regiones principales (las primeras 9)
      const mainRegions = data.filter(r => r.id <= 9);
      setRegions(mainRegions);
    } catch (error) {
      console.error('Error loading regions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionClick = async (region: Region) => {
    setSelectedRegion(region);
    setLoadingLocations(true);
    
    try {
      const locationData = await fetchLocationsByRegion(region.name);
      setLocations(locationData);
    } catch (error) {
      console.error('Error loading locations:', error);
      setLocations([]);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleBackToRegions = () => {
    setSelectedRegion(null);
    setLocations([]);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ScrollToTop />
      <Header query="" setQuery={() => {}} />

      <main className={styles.container}>
        {!selectedRegion ? (
          <>
            <div className={styles.header}>
              <h1 className={styles.title}>🗺️ Regiones Pokémon</h1>
              <p className={styles.subtitle}>
                Explora las diferentes regiones del mundo Pokémon
              </p>
            </div>

            <div className={styles.regionsGrid}>
              {regions.map((region) => (
                <RegionCard
                  key={region.id}
                  region={region}
                  onClick={() => handleRegionClick(region)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <button className={styles.backButton} onClick={handleBackToRegions}>
              ← Volver a regiones
            </button>

            <div className={styles.header}>
              <h1 className={styles.title}>
                {selectedRegion.name.charAt(0).toUpperCase() + selectedRegion.name.slice(1)}
              </h1>
              <p className={styles.subtitle}>
                {locations.length} locaciones disponibles
              </p>
            </div>

            {loadingLocations ? (
              <div className={styles.loadingText}>Cargando locaciones...</div>
            ) : locations.length === 0 ? (
              <div className={styles.noResults}>
                <p>No se encontraron locaciones</p>
              </div>
            ) : (
              <div className={styles.locationsGrid}>
                {locations.map((location) => (
                  <LocationCard key={location.id} location={location} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Map;