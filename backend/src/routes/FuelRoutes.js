const router = require('express').Router();

const FuelController = require('../app/controllers/FuelController');

// middlewares
const verifyToken = require('../app/helpers/verify-token');

// gets
router.get('/', FuelController.getAllFuels);
router.get('/myfuels', verifyToken, FuelController.getAllUserFuels);
router.get('/:id', FuelController.getFuelById);

// posts
router.post('/addfuel', verifyToken, FuelController.fuelRegister);

// patches
router.patch('/updatefuel/:id', verifyToken, FuelController.updateFuelById);

// deletes
router.delete('/removefuel/:id', verifyToken, FuelController.removeFuelById);

module.exports = router;