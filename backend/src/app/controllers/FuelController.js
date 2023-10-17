// models
const Fuel = require('../models/Fuel');

// helpers
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');

// imports gerais
const ObjectId = require('mongoose').Types.ObjectId;
require('dotenv').config();
const axios = require('axios');
const request = require('request');

module.exports = class FuelController {
  // registra um posto no mongodb
  static async fuelRegister(req, res) {
    const { name, address, brand, price } = req.body;

    console.log(req.body);
    // validações
    if (!name) { return res.status(422).json({message: 'O nome do posto é obrigatório!'}); }
    if (!address) { return res.status(422).json({message: 'O endereço do posto é obrigatório!'}); }
    if (!brand) { return res.status(422).json({message: 'A marca/bandeira do posto é obrigatório!'}); }
    if (!price) { return res.status(422).json({message: 'O preço é obrigatório!'}); }
    
    // verificar se o posto já está cadastrado
    const fuelExists = await Fuel.findOne({address: address});
    if (fuelExists) { return res.status(422).json({message: 'Esse posto já está cadastrado!'}); }
    
    // funçao que busca as coordenadas pelo endereço 
    async function getCoords(endereco) {
      try{
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: endereco,
            key: apiKey,
          },
        });
        const { results } = response.data;
        if (results.length > 0) {
          const { location } = results[0].geometry;
          return location;
        } else {
          res.status(422).json({message: 'Endereço não encontrado!'});
        }
      } catch (err) {
        return res.status(422).json({message: `Erro ao obter latitude e longitude: ${err}`});
      }
    }

    // chama a função 'getCoords' e retorna um objeto com a latitude e longitude
    const coordinates = await getCoords(address)
    .then((location) => {
      const coords = {
        lat: location.lat,
        lng: location.lng,
      };
      return coords;
    })
    .catch((err) => {
      console.error(err.message);
    });

    // cria o link do local
    const link = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
    console.log(link);
    
    // busca o dono do posto
    const token = getToken(req);
    const user = await getUserByToken(token);

    // criando um posto
    const fuel = new Fuel ({
      name,
      address,
      link,
      lat: coordinates.lat,
      lng: coordinates.lng,
      brand,
      price,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email
      },
    });

    // trata algum erro se ocorrer enquanto salva os dados do mongodb
    try {
      const newFuel = await fuel.save();
      res.status(201).json({message: 'Posto criado com sucesso!', newFuel});
    } catch (err) {
      res.status(500).json({message: err});
    }
  }


  // retorna todos os postos presentes no banco de dados
  static async getAllFuels(req, res) {

    // função que faz o calculo da distancia entre dois pontos na Terra utilizndo a fórmula de Haversine
    function calcularDistancia (lat1, lng1, lat2, lng2) {
      const R = 6371; // raio da Terra em Km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLng = (lng2 - lng1) * (Math.PI / 180);
      const a = 
        Math.pow(Math.sin(dLat / 2), 2) + Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.pow(Math.sin(dLng / 2), 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distancia = R * c; // Distancia em Km
      return distancia;
    }

    // busca o endereço pelo IP do usuário
    const url = 'http://ip-api.com/json';
    request(url, async (err, response, body) => {
      if (err) {
        console.log(err);
        return res.status(500).json({message: 'Erro ao obter localização do usuário!'});
      }
      
      const ipInfo = JSON.parse(body);
      const locAtual = {
        lat: ipInfo.lat,
        lng: ipInfo.lon,
      };

      // Verifica se existe algum posto no banco de dados
      const postos = await Fuel.find();
      if (!postos) {
        return res.status(400).json({message: 'Não há nenhum posto cadastrado no banco de dados!'});
      }

      // Calcula a distância entre o usuário e cada posto e adiciona a distância ao posto
      postos.forEach((posto) => {
        posto.distancia = calcularDistancia(locAtual.lat, locAtual.lng, posto.lat, posto.lng);
      });

      // Ordena os postos com base na distância
      postos.sort((a, b) => a.distancia - b.distancia);

      return res.status(200).json({ postos });
    });
  }

  // retorna todos os postos do banco de dados cadastrados por um usuário específico.
  static async getAllUserFuels(req, res) {
    // busca o usuário pelo token
    const token = getToken(req);
    const user = await getUserByToken(token);

    const fuels = await Fuel.find({'user._id': user._id}).sort('-createdAt');
    
    res.status(200).json({ fuels });
  }

  // retorna o posto pelo ID do mesmo
  static async getFuelById (req, res) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) { return res.status(422).json({ message: 'ID  inválido!'}); }

    const fuel = await Fuel.findOne({_id: id});
    if (!fuel) { return res.status(404).json({message: 'Posto não encontrado!'}); }

    res.status(200).json({ fuel });
  }

  static async updateFuelById(req, res) {
    const id = req.params.id;

    const { name, address, brand, price } = req.body;

    const updatedData = {}

    // verifico se o ID é válido
    if (!ObjectId.isValid(id)) { return res.status(422).json({message: 'ID inválido!'}); }
    
    // verifico se o local existe
    const fuel = await Fuel.findOne({_id: id});
    if (!fuel) {return res.status(404).json({message: 'Posto não encontrado!'});}

    // verifica se o usuário logado é o mesmo que cadastrou o posto
    const token = getToken(req);
    const user =  await getUserByToken(token);

    if (fuel.user._id.toString !== user._id.toString){ 
      return res.status(422).json({message: 'Houve um problema em processar sua solicitação, tente novamente mais tarde!'});
    }

    // validações e atribuições dos novos valores
    if (!name) { return res.status(422).json({message: 'O nome do posto é obrigatório!'});}
    else { updatedData.name = name }
    
    if (!address) { return res.status(422).json({message: 'O endereço do posto é obrigatório!'});}
    else { updatedData.address = address }
    
    if (!brand) { return res.status(422).json({message: 'A marca/bandeira do posto é obrigatória!'});}
    else { updatedData.brand = brand }
    
    if (!price) { return res.status(422).json({message: 'O preço da gasolina neste posto é obrigatório!'});}
    else { updatedData.price = price }

    try{
      await Fuel.findByIdAndUpdate(id, updatedData);
      res.status(200).json({message: 'Posto atualizado com sucesso!'});
    } catch (err) {
      res.status(500).json({ err });
    }
  }

  // remove um posto pelo ID do mesmo
  static async removeFuelById(req, res) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) { return res.status(422).json({message: 'ID inválido!' }); }

    const fuel = await Fuel.findOne({_id: id});
    if (!fuel) { return res.status(404).json({ message: 'Posto não encontrado!' }); }

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (fuel.user._id.toString() !== user._id.toString()) {
      return res.status(422).json({ message: 'Houve um problema em processar sua solicitação, tente novamente mais tarde!' });
    }

    await Fuel.findByIdAndRemove(id);
    res.status(200).json({message: 'Posto removido com sucesso!'});
  }
}