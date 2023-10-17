import styles from './Dashboard.module.css';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// hooks
import useFlashMessage from '../../../hooks/useFlashMessage';

// utils
import api from '../../../utils/api';

function MyFuels() {
  const [fuels, setFuels] = useState([]);
  const [token] = useState(localStorage.getItem(('token') || ''));
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api.get('/fuels/myfuels', {
      headers: {
        'Authorization': `Bearer ${JSON.parse(token)}`,
        'Accept':  'application/json',
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      setFuels(response.data.fuels);
    });
  }, [token]);

  async function removeFuel(id) {
    let msgType = 'success';

    const data = await api.delete(`/fuels/removefuel/${id}`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(token)}`,
        'Accept':  'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then((response) => {
      const updatedFuels = fuels.filter((fuel) => fuel._id !== id);
      setFuels(updatedFuels);
      return response.data;
    })
    .catch((err) => {
      msgType = 'error';
      return err.response.data;
    })

    setFlashMessage(data.message, msgType);
  }

  return ( 
      <section>
        <div className={styles.fuellist_header}>
          <h1>Meus Postos</h1>
          <Link to='/fuel/addfuel'>Cadastrar Posto</Link>
        </div>
        <div className={styles.fuellist_container}>
          { fuels.length > 0 && 
            fuels.map((fuel) => (
              <div className={styles.fuellist_row} key={fuel._id}>
                <span className='bold'>{fuel.name}</span>
                <div className={styles.actions}>
                  <Link to={`/fuel/edit/${fuel._id}`}>Editar</Link>
                  <button onClick={() => removeFuel(fuel._id)}>Excluir</button>
                </div>
              </div>
            ))
          }
          { fuels.length === 0 && <p>Não há postos cadastrados!</p> }
        </div>
      </section>
   );
}

export default MyFuels;