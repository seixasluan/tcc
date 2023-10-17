import api from '../../utils/api';

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import styles from './Home.module.css';

function Home() {
  const [fuels, setFuels] = useState([]);

  useEffect(() => {
    api.get('/fuels').then((response) => {
        setFuels(response.data.postos);
      })
      .catch((error) => {
        console.log('Erro na requisição à API:', error);
      });
  }, []);

  return (
    <section>
      <div className={styles.fuel_home_header}>
        <h1>Confira os postos mais próximos à você!</h1>
        <p>Veja também algumas avaliações dos mesmos!</p>
      </div>
      <div className={styles.fuel_container}>
         {fuels.length > 0 && 
          fuels.map((fuel) => (
            <div className={styles.fuel_card}>
              <h3>{fuel.name}</h3>
              <p>
                <span className='bold'>Preço do combustível:</span> R$ {fuel.price}
              </p> 
              <Link to={`fuel/${fuel._id}`}>Mais detalhes</Link> 
            </div>
          ))
        }
        {fuels.length === 0 &&  (
          <p>Não há postos cadastrados no momento, cadastre um agora mesmo!</p>
        )}
      </div>
    </section>
  );
}

export default Home;