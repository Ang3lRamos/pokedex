import { useNavigate, useParams } from "react-router-dom";
import pokeball from "../assets/pokeball.png"
import bulbasaur from "../assets/bulbasaur.gif"
import Footer from "../components/Footer";
import styles from "./pokemon.module.css"
import { useEffect, useState } from "react";
import { PokemonDetails } from "../types/types";
import { fetchPokemon } from "../api/fetchPokemon";
import LoadingScreen from "../components/LoadingScreen";
import { waitFor } from "../utils/Utils";
const Pokemon = () => {
  const {name} = useParams();
  const navigate = useNavigate();

  const [isLoading,setIsLoading] = useState(false);
  const [pokemon,setPokemon] = useState<PokemonDetails>();

  useEffect(() => {
    async function getPokemon(){
      setIsLoading(true);
      await waitFor(500)
      const fetchedPokemon = await fetchPokemon(name as string);
      setPokemon(fetchedPokemon);
      setIsLoading(false);
    }
  getPokemon()
  },[name])

  if(isLoading || !pokemon) return <LoadingScreen/>
  return (
    <>
      <button className={styles.pokeballButton} onClick={() => navigate(-1)}>
        <img className={styles.pokeballImage} src={pokeball} alt="pokeball"/>
        Go back
      </button>
      <div className={styles.pokemon}>
        <main className={styles.pokemonInfo}>
          <div className={styles.pokemonTittle}>
            {pokemon?.name?.toUpperCase()}
          </div>
          <div>
            Nr. {pokemon?.id}
          </div>
          <div>
            <img className={styles.pokemonInfoImg} src={pokemon?.imgSrc} alt={pokemon?.name}/>
          </div>
          <div>
            HP: {pokemon?.hp}
          </div>
          <div>
            ATK: {pokemon?.attack}
          </div>
          <div>
            DEF: {pokemon?.defense}
          </div>
        </main>
      </div>
      <Footer/>
    </>
    );
};

export default Pokemon;