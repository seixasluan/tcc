import api from '../../../utils/api';

import styles from './AddFuel.module.css';

import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// components
import FuelForm from '../../form/FuelForm';

// hooks
import useFlashMessage from '../../../hooks/useFlashMessage';


function AddFuel () {
  const [token] = useState(localStorage.getItem('token') || '');
  const { setFlashMessage } = useFlashMessage();
  const history = useNavigate();

  async function registerFuel(fuel) {
    let msgType = 'success';
    const formData = new FormData();
    
    console.log(fuel)
    Object.keys(fuel).forEach((key) => {
      formData.append(key, fuel[key]);
    });

    const data = await api.post('fuels/addfuel', formData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
        'Accept':  'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then((response) => {

      return response.data;

    }).catch((err) => {

      msgType = 'error'
      return err.response.data;

    });

    setFlashMessage(data.message, msgType);
    
    if (msgType !== 'error') { history('/fuel/myfuels'); }
  }

  return ( 
    <section>
      <div className={styles.addfuel_header}>
        <h1>Cadastre um Posto</h1>
        <p>Depois ele ficará disponível para vizualização de outros usuários!</p>
      </div>
      <FuelForm btnText='Cadastrar Posto' handleSubmit={registerFuel}/>
    </section>
  );
}

export default AddFuel;