import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import {Items, Pokemons, Pokemon} from "./pages"
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/pokemons/:name" element={<Pokemon/>} />
          <Route path="/pokemons" element={<Pokemons/>}/>
          <Route path="/items" element={<Items/>} />
          <Route path="/" element={<Pokemons/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
