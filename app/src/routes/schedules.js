const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');

//Ruta para listar todos los establecimientos del sistema
router.get('/', isLoggedIn, async (req, res) => {
    const id_user = req.user.id_user;
    schedules = await pool.query('SELECT * FROM schedule AS she INNER JOIN establecimiento AS est ON est.id_establecimiento = she.id_establecimiento INNER JOIN establecimiento_user AS est_usr ON est_usr.id_establecimiento = est.id_establecimiento WHERE est_usr.id_user = ?', [id_user]);
    res.render('schedules/list', {schedules});
});

//Ruta para crear nuevos horarios en el sistema
router.get('/create', isLoggedIn, async (req, res) => {
    const id_user = req.user.id_user;
    establishment = await pool.query('SELECT * FROM establecimiento AS est INNER JOIN establecimiento_user AS est_usr ON est_usr.id_establecimiento = est.id_establecimiento WHERE est_usr.id_user = ?', [id_user]);
    res.render('schedules/create', {establishment});
});

router.post('/save', isLoggedIn, async (req, res) => {
    let data = req.body;
    let created_at = new Date();
    let status_schedule = 3;
    const { id_establecimiento, 
        name_schedule, 
        description_schedule, 
        start_hour_monday,
        end_hour_monday,
        start_hour_tuesday,
        end_hour_tuesday,
        start_hour_wednesday,
        end_hour_wednesday,
        start_hour_thursday,
        end_hour_thursday,
        start_hour_friday,
        end_hour_friday,
        start_hour_saturday,
        end_hour_saturday,
        start_hour_sunday,
        end_hour_sunday} = data;

    const newSchedule = {
        id_establecimiento,
        name_schedule,
        description_schedule,
        status_schedule,
        created_at
    };

    const schedule_name = await pool.query('SELECT name_schedule FROM schedule WHERE name_schedule = ? AND id_establecimiento = ?', [name_schedule, id_establecimiento]);
    if(schedule_name.length > 0){
        return res.send('schedule_name');
    }else{
        const query_schedule = await pool.query('INSERT INTO schedule SET ?', [newSchedule]);
        const id_schedule = query_schedule.insertId; 
        const newSceduleDetail = {
            id_schedule,
            start_hour_monday,
            end_hour_monday,
            start_hour_tuesday,
            end_hour_tuesday,
            start_hour_wednesday,
            end_hour_wednesday,
            start_hour_thursday,
            end_hour_thursday,
            start_hour_friday,
            end_hour_friday,
            start_hour_saturday,
            end_hour_saturday,
            start_hour_sunday,
            end_hour_sunday
        };
        const query_schedule_detail = await pool.query('INSERT INTO schedule_detail SET ?', [newSceduleDetail]);
        if(query_schedule_detail){
            res.send(true);
        }else{
            res.send(false);
        }
    }
});

//Ruta para obtener los datos al detalle del establecimiento
router.get('/detail/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const schedules = await pool.query('SELECT * FROM schedule AS she INNER JOIN schedule_detail AS she_det ON she_det.id_schedule = she.id_schedule INNER JOIN establecimiento as est ON est.id_establecimiento = she.id_establecimiento WHERE she.id_schedule = ? ORDER BY she.created_at desc', [id]);
    const data = schedules[0];
    res.json(data);
});

module.exports = router;