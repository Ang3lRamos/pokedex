import { useEffect, useState } from 'react';
import { Location } from '../api/items-locations';
import styles from './locationDetail.module.css';

interface LocationDetailProps {
  location: Location;
  onClose: () => void;
}

interface AreaEncounter {
  pokemon: string;
  methods: string[];
}

const LocationDetail = ({ location, onClose }: LocationDetailProps) => {
  const [encounters, setEncounters] = useState<AreaEncounter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEncounters();
  }, [location]);

  const loadEncounters = async () => {
    try {
      setLoading(true);
      const allEncounters: AreaEncounter[] = [];
      
      // Obtener encuentros de las primeras 3 áreas (para no sobrecargar)
      const areasToCheck = location.areas.slice(0, 3);
      
      for (const area of areasToCheck) {
        try {
          const response = await fetch(area.url);
          const areaData = await response.json();
          
          if (areaData.pokemon_encounters && areaData.pokemon_encounters.length > 0) {
            areaData.pokemon_encounters.forEach((encounter: any) => {
              const pokemonName = encounter.pokemon.name;
              const methods = encounter.version_details
                .flatMap((vd: any) => vd.encounter_details.map((ed: any) => ed.method.name))
                .filter((v: any, i: any, a: any) => a.indexOf(v) === i);
              
              allEncounters.push({
                pokemon: pokemonName,
                methods: methods
              });
            });
          }
        } catch (error) {
          console.error('Error fetching area:', error);
        }
      }
      
      // Eliminar duplicados
      const uniqueEncounters = allEncounters.reduce((acc: AreaEncounter[], curr) => {
        const existing = acc.find(e => e.pokemon === curr.pokemon);
        if (!existing) {
          acc.push(curr);
        } else {
          // Combinar métodos y eliminar duplicados sin usar spread en Set
          const combinedMethods = existing.methods.concat(curr.methods);
          existing.methods = Array.from(new Set(combinedMethods));
        }
        return acc;
      }, []);
      
      setEncounters(uniqueEncounters.slice(0, 20)); // Limitar a 20 para no saturar
    } catch (error) {
      console.error('Error loading encounters:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getMethodIcon = (method: string) => {
    const icons: Record<string, string> = {
      walk: '🚶',
      'old-rod': '🎣',
      'good-rod': '🎣',
      'super-rod': '🎣',
      surf: '🌊',
      'rock-smash': '🪨',
      headbutt: '🌳',
      'dark-grass': '🌿',
      'gift': '🎁',
      'gift-egg': '🥚'
    };
    return icons[method] || '❓';
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>

        <div className={styles.header}>
          <h2 className={styles.title}>{formatName(location.name)}</h2>
          <p className={styles.region}>Región: {formatName(location.region)}</p>
        </div>

        <div className={styles.section}>
          <h3>📍 Información</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Áreas disponibles</span>
              <span className={styles.value}>{location.areas.length}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>ID de ubicación</span>
              <span className={styles.value}>#{location.id}</span>
            </div>
          </div>
        </div>

        {location.areas.length > 0 && (
          <div className={styles.section}>
            <h3>🗺️ Áreas</h3>
            <div className={styles.areasList}>
              {location.areas.slice(0, 10).map((area, index) => (
                <span key={index} className={styles.areaBadge}>
                  {formatName(area.name.split('/').pop() || area.name)}
                </span>
              ))}
              {location.areas.length > 10 && (
                <span className={styles.areaBadge}>
                  +{location.areas.length - 10} más
                </span>
              )}
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h3>🎮 Pokémon Encontrados</h3>
          {loading ? (
            <div className={styles.loading}>Cargando encuentros...</div>
          ) : encounters.length === 0 ? (
            <p className={styles.noData}>No hay información de encuentros disponible para esta ubicación.</p>
          ) : (
            <div className={styles.encountersList}>
              {encounters.map((encounter, index) => (
                <div key={index} className={styles.encounterCard}>
                  <div className={styles.pokemonName}>
                    {formatName(encounter.pokemon)}
                  </div>
                  <div className={styles.methods}>
                    {encounter.methods.map((method, i) => (
                      <span key={i} className={styles.methodBadge} title={formatName(method)}>
                        {getMethodIcon(method)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;