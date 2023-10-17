import { useState } from 'react';

import formStyles from './Form.module.css';

import Input from  './Input';

function FuelForm({handleSubmit, fuelData, btnText}) {
  const [fuel, setFuel] = useState(fuelData || {});

  function handleChange(e) {
    setFuel({...fuel, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    handleSubmit(fuel);
  }

  return (
    <form onSubmit={submit} className={formStyles.form_container}>
      <Input 
        text='Nome do posto'
        type='text'
        name='name'
        handleOnChange={handleChange}
        value={fuel.name || ''}
      />

      <Input 
        text='Endereço do posto'
        type='text'
        name='address'
        handleOnChange={handleChange}
        value={fuel.address || ''}
      />

      <Input 
        text='Marca/Bandeira do posto'
        type='text'
        name='brand'
        handleOnChange={handleChange}
        value={fuel.brand || ''}
      />

      <Input 
        text='Preço da gasolina'
        type='text'
        name='price'
        handleOnChange={handleChange}
        value={fuel.price || ''}
      />

      <input type='submit' value={btnText} />
    </form>
  );
}

export default FuelForm;