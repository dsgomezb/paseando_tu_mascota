const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');

//Api para capturar id de usuario, consultar sus mascotas enviarlas al front para gestion de mascotas
router.post('/api/get_pets_user', async (req, res) => {
    const { user_id } = req.body;
    const user_pets = await pool.query('SELECT pe.name_pet as name_pet, pe.age_pet as age_pet, pe.race_pet as race_pet,\
            pe.color_pet as color_pet, pe.gender_pet as gender_pet , pe.pet_observation as pet_observation , pe.pet_status as pet_status\
            FROM user_pets AS up\
            INNER JOIN pets AS pe ON pe.id_pet = up.id_pet\
            WHERE up.id_user = ? AND pe.pet_status = 1', [user_id]);
    data = {
        "code": "0",
        "data": user_pets
    };
    res.status(200).json(data);
});

//Eliminar a una mascota
router.post('/api/delete_pet', async (req, res) => {
    const { id_pet } = req.body;
    let pet_status = 2;
    const delete_pet = await pool.query('UPDATE pets SET pet_status = ? WHERE id_pet = ?', [pet_status, id_pet]);
    if(delete_pet){
        data = {
            "code": "0",
            "message": "Mascota eliminada correctamente",
            "delete": true
        };
    }else{
        data = {
            "code": "1",
            "update": false,
            "error": "Error al eliminar la mascota"
        };
    }
    res.status(200).json(data);
});


//Devuelve los datos de una mascota para mostrarlos en el detalle
router.post('/api/get_pet', async (req, res) => {
    const { id_pet } = req.body;
    const pet = await pool.query('SELECT * FROM pets WHERE id_pet = ?', [id_pet]);
    if(pet){
        data = {
            "code": "0",
            "message": "Mascota listada correctamente",
            "data": pet
        };
    }else{
        data = {
            "code": "1",
            "update": false,
            "error": "Error al listar la mascota"
        };
    }
    res.status(200).json(data);
});

module.exports = router;