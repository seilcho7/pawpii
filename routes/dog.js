const express = require('express');
const Router = express.Router;
const dogRoutes = Router();

const {
    getAll,
    checkLogin, 
    statesPost
} = require('../controllers/dog');

const {
    getAllDogs
} = require('../controllers/organization')

dogRoutes.get('/', checkLogin, getAll);
dogRoutes.get('/:id', getAllDogs);
dogRoutes.post('/', statesPost);

module.exports = dogRoutes;