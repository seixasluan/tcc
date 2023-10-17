import api from '../../../utils/api';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import styles from './FuelDetails.module.css';

// LEMBRAR DE ATUALIZAR O LINK DO MAPA TAMBÉM

function FuelDetails() {
  const [fuel, setfuel] = useState({});
  const {id} = useParams();

  useEffect(() => {
    api.get(`/fuels/${id}`)
      .then((response) => {
        setfuel(response.data.fuel);
      })
      .catch((err) => {
        return err.response.data.message;
      });
  }, [id]);


  
  return (
    <>
      {fuel.name && (
        <section className={styles.fuel_datails_container}>
          <div className={styles.fuel_details_header}>
            <h1>Conhecendo o Posto: {fuel.name}</h1>
          </div>
          <p>
            <span className='bold'>Endereço: </span> {fuel.address}
          </p>
          <p>
            <span className='bold'>Link da localização: </span> <a rel='noreferrer' href={fuel.link} target='_blank'>Vizualizar posto no mapa</a>
          </p>
          <p>
            Obs: As localizações presentes no link acima podem não estar 100% precisas.
          </p>
          <p>
            <span className='bold'>Preço da Gasolina: </span> R$ {fuel.price}
          </p>
        </section>
      )}
    </>
  );
}

export default FuelDetails;