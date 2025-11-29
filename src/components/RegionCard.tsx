import { Region } from '../api/items-locations';
import styles from './regionCard.module.css';

interface RegionCardProps {
  region: Region;
  onClick: () => void;
}

const RegionCard = ({ region, onClick }: RegionCardProps) => {
  const getRegionColor = (regionName: string): string => {
    const colors: Record<string, string> = {
      kanto: '#FF6B6B',
      johto: '#4ECDC4',
      hoenn: '#45B7D1',
      sinnoh: '#96CEB4',
      unova: '#FFEAA7',
      kalos: '#DFE6E9',
      alola: '#FD79A8',
      galar: '#A29BFE',
      paldea: '#6C5CE7'
    };
    return colors[regionName.toLowerCase()] || '#667eea';
  };

  const getRegionEmoji = (regionName: string): string => {
    const emojis: Record<string, string> = {
      kanto: '🏔️',
      johto: '🌸',
      hoenn: '🌊',
      sinnoh: '❄️',
      unova: '🏙️',
      kalos: '🗼',
      alola: '🏝️',
      galar: '🏰',
      paldea: '🦎'
    };
    return emojis[regionName.toLowerCase()] || '🗺️';
  };

  const formatName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const regionColor = getRegionColor(region.name);

  return (
    <div
      className={styles.card}
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${regionColor}dd, ${regionColor}99)`
      }}
    >
      <div className={styles.emoji}>{getRegionEmoji(region.name)}</div>
      <h3 className={styles.name}>{formatName(region.name)}</h3>
      <p className={styles.locationCount}>
        {region.locations.length} locaciones
      </p>
      <div className={styles.viewButton}>Explorar →</div>
    </div>
  );
};

export default RegionCard;