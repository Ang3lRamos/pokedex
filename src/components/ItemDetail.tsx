import { Item } from '../api/items-locations';
import styles from './itemDetail.module.css';

interface ItemDetailProps {
  item: Item;
  onClose: () => void;
}

const ItemDetail = ({ item, onClose }: ItemDetailProps) => {
  const formatName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatCost = (cost: number) => {
    if (cost === 0) return 'No disponible para compra';
    return `₽${cost.toLocaleString()}`;
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>

        <div className={styles.header}>
          <img
            src={item.imgSrc}
            alt={item.name}
            className={styles.itemImage}
          />
          <div className={styles.headerInfo}>
            <span className={styles.id}>#{String(item.id).padStart(3, '0')}</span>
            <h2 className={styles.name}>{formatName(item.name)}</h2>
            <p className={styles.category}>{formatName(item.category)}</p>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Precio</h3>
          <p className={styles.cost}>{formatCost(item.cost)}</p>
        </div>

        <div className={styles.section}>
          <h3>Efecto</h3>
          <p className={styles.effect}>{item.effect}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;