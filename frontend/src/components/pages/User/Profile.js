import api from  '../../../utils/api';

import { useState, useEffect } from 'react';

import styles from './Profile.module.css';
import formStyles from '../../form/Form.module.css';

import Input from '../../form/Input';

import useFlashMessage from  '../../../hooks/useFlashMessage';

function Profile() {  
  const [user, setUser] = useState({});
  const [token] = useState(localStorage.getItem('token') || '');
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api.get('/users/checkuser', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
        'Accept':  'application/json',
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      setUser(response.data);
    });
  }, [token]);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleSubmit (e) {
    e.preventDefault();
    let msgType = 'success';

    const formData = new FormData();

    Object.keys(user).forEach((key) => formData.append(key, user[key]));

    const data = await api.patch(`/users/edituser/${user._id}`, formData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
        'Accept':  'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.data;
    }).catch((err) => {
      msgType = 'error';
      return err.response.data;
    });

    setFlashMessage(data.message, msgType);

  }

  return (
    <section>
      <div className={styles.profile_header}>
        <h1>Perfil</h1>
      </div>
      <form onSubmit={handleSubmit} className={formStyles.form_container}>
        <Input
          name='email'
          type='email'
          text='Email'
          placeholder='Digite o seu email'
          handleOnChange={handleChange}
          value={user.email || ''}
        />
        <Input
          name='name'
          type='text'
          text='Nome'
          placeholder='Digite o novo nome'
          handleOnChange={handleChange}
          value={user.name || ''}
        />
        <Input
          name='phone'
          type='text'
          text='Telefone'
          placeholder='Digite o novo telefone'
          handleOnChange={handleChange}
          value={user.phone || ''}
        />
        <Input
          name='password'
          type='password'
          text='Nova senha'
          placeholder='Digite a nova senha'
          handleOnChange={handleChange}
        />
        <Input
          name='confirmPassword'
          type='password'
          text='Confirmação de nova senha'
          placeholder='Confirme a nova senha'
          handleOnChange={handleChange}
        />
        <input type='submit' value='Editar'/>
      </form>
    </section>
  );
}

export default Profile;
