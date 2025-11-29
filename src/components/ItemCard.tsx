import { useState } from 'react';
import { Item } from '../api/items-locations';
import ItemDetail from './ItemDetail';
import styles from './itemCard.module.css';

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const [showDetail, setShowDetail] = useState(false);

  const formatName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatCost = (cost: number) => {
    if (cost === 0) return 'No disponible';
    return `₽${cost.toLocaleString()}`;
  };

  return (
    <>
      <div 
        className={styles.card}
        onClick={() => setShowDetail(true)}
      >
        <div className={styles.imageContainer}>
          <img
            src={item.imgSrc}
            alt={item.name}
            className={styles.image}
            loading="lazy"
          />
        </div>

        <div className={styles.info}>
          <h3 className={styles.name}>{formatName(item.name)}</h3>
          <p className={styles.category}>{formatName(item.category)}</p>
          <p className={styles.cost}>{formatCost(item.cost)}</p>
        </div>
      </div>

      {showDetail && (
        <ItemDetail
          item={item}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
};

export default ItemCard;