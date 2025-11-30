import { useState } from 'react';
import { Location } from '../api/items-locations';
import LocationDetail from './LocationDetail';
import styles from './locationCard.module.css';

interface LocationCardProps {
  location: Location;
}

const LocationCard = ({ location }: LocationCardProps) => {
  const [showDetail, setShowDetail] = useState(false);

  const formatName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getLocationIcon = (name: string): string => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('city') || lowerName.includes('town')) return '🏘️';
    if (lowerName.includes('route')) return '🛣️';
    if (lowerName.includes('cave')) return '🕳️';
    if (lowerName.includes('forest') || lowerName.includes('woods')) return '🌲';
    if (lowerName.includes('mountain') || lowerName.includes('peak')) return '⛰️';
    if (lowerName.includes('sea') || lowerName.includes('ocean') || lowerName.includes('bay')) return '🌊';
    if (lowerName.includes('lake')) return '💧';
    if (lowerName.includes('island')) return '🏝️';
    if (lowerName.includes('tower') || lowerName.includes('building')) return '🏢';
    if (lowerName.includes('gym')) return '🏟️';
    if (lowerName.includes('league')) return '🏆';
    if (lowerName.includes('victory')) return '🎖️';
    if (lowerName.includes('safari')) return '🦒';
    if (lowerName.includes('power') || lowerName.includes('plant')) return '⚡';
    if (lowerName.includes('tunnel') || lowerName.includes('path')) return '🚇';
    
    return '📍';
  };

  return (
    <>
      <div className={styles.card} onClick={() => setShowDetail(true)}>
        <div className={styles.icon}>{getLocationIcon(location.name)}</div>
        <div className={styles.info}>
          <h3 className={styles.name}>{formatName(location.name)}</h3>
          <p className={styles.region}>Región: {formatName(location.region)}</p>
          {location.areas.length > 0 && (
            <p className={styles.areas}>{location.areas.length} áreas</p>
          )}
        </div>
      </div>

      {showDetail && (
        <LocationDetail
          location={location}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
};

export default LocationCard;