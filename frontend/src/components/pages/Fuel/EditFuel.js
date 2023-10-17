import api from "../../../utils/api";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import styles from './AddFuel.module.css';
import useFlashMessage from "../../../hooks/useFlashMessage";
import FuelForm from "../../form/FuelForm";
import { useNavigate } from "react-router-dom";

function EditFuel() {

  const [fuel, setFuel] = useState({});
  const [token] = useState(localStorage.getItem('token') || '');
  const { id } = useParams();
  const { setFlashMessage } = useFlashMessage();
  const history = useNavigate();

  useEffect(() => {
    api.get(`/fuels/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
        'Accept':  'application/json',
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      setFuel(response.data.fuel);
    });
  }, [token, id]);

  async function updatefuel (fuel) {
    let msgType = 'success';

    const formData = new FormData();

    Object.keys(fuel).forEach((key) => {
      formData.append(key, fuel[key]);
    });

    const data = await api.patch(`fuels/updatefuel/${fuel._id}`, formData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
        'Accept':  'application/json',
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      setFuel(formData);
      return response.data;
    }).catch((err) => {
      msgType = 'error';
      return err.response.data;
    });

    setFlashMessage(data.message, msgType);
    if (msgType === 'success') history('/');
  }

  return (
    <section>
      <div className={styles.addfuel_header}>
        <h1>Editando o Posto: {fuel.name}</h1>
        <p>Depois da atualização os dados serão atualizados no sistema</p>
      </div>
      {fuel.name && (
        <FuelForm handleSubmit={updatefuel} btnText='Atualizar' fuelData={fuel}/>
      )}
    </section>
  );
}

export default EditFuel;