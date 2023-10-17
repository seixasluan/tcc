const mongoose = require('../../db/conn');
const { Schema } = mongoose;

const Fuel = mongoose.model(
  'Fuel',
  new Schema({
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    lat: {
      type: String,
      required: false,
    },
    lng: {
      type: String,
      required: false,
    },
    link: {
      type: String,
      required: false,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    user: Object,
  }, 
    {timestamps: true},
  )
);

module.exports = Fuel;