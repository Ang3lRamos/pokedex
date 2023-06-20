import React from 'react';
import { Link } from 'react-router-dom';
import Pokeball from "../assets/pokeball.png"
import Pikachu from "../assets/pikachu.png"
import location from "../assets/pointer.png"
import styles from "./footer.module.css"
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Link 
      className={styles.footerLink} 
      to="/pokemons">
        <img 
        className={styles.footerIcon} 
        src={Pokeball} 
        alt="pokeball"/>
        Pokemons
      </Link>
      <Link 
      className={styles.footerLink} 
      to="/items"
      onClick={(e)=> e.preventDefault()}>
        <img 
        className={styles.footerIcon} 
        src={Pikachu} 
        alt="pokeball"/>
        Items
      </Link>
      <Link 
      className={styles.footerLink} 
      to="/map"
      onClick={(e)=> e.preventDefault()}>
        <img 
        className={styles.footerIcon} 
        src={location} 
        alt="pokeball"/>
        Map
      </Link>
    </footer>
  );
};

export default Footer;