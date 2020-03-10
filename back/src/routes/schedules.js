const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');

//Ruta para cargar la informacion de un horario en la edición
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    if(req.user.id_profile == 2){
        const id_user = req.user.id_user;
        const { id } = req.params;
        const schedules = await pool.query('SELECT * FROM schedule AS she INNER JOIN establecimiento AS est ON est.id_establecimiento = she.id_establecimiento INNER JOIN establecimiento_user AS est_usr ON est_usr.id_establecimiento = est.id_establecimiento INNER JOIN schedule_detail as sche_det ON sche_det.id_schedule = she.id_schedule WHERE she.id_schedule = ?', [id]);
        const schedule = schedules[0];
        establishment = await pool.query('SELECT * FROM establecimiento AS est INNER JOIN establecimiento_user AS est_usr ON est_usr.id_establecimiento = est.id_establecimiento WHERE est_usr.id_user = ? AND est.id_establecimiento != ?', [id_user, schedule.id_establecimiento]);
        res.render('schedules/edit', {schedule, establishment});
    }else{
        res.status(401);
        res.render('partials/errors/route');
    } 
});

//Ruta para marcar como no disponible un Horario
router.get('/available/:id', isLoggedIn, async (req, res) => {
    if(req.user.id_profile == 2){
        const { id } = req.params;
        let deleted_at = new Date();
        let status_schedule = 3;
        let status_schedule_una = 4;
        const establecimiento = await pool.query('SELECT id_establecimiento FROM schedule WHERE id_schedule = ?',[id]);
        const query_una = await pool.query('UPDATE schedule set status_schedule = ? WHERE id_establecimiento = ?',[status_schedule_una, establecimiento[0].id_establecimiento]);
        const query_available = await pool.query('UPDATE schedule set status_schedule = ? WHERE id_schedule = ?',[status_schedule,  id]);
        if(query_available){
            res.send(true);
        }else{
            res.send(false);
        }
    }else{
        res.send(false);
    }
});

//Ruta para listar todos los Horarios del sistema
router.get('/', isLoggedIn, async (req, res) => {
    if(req.user.id_profile == 2){
        const id_user = req.user.id_user;
        schedules = await pool.query('SELECT * FROM schedule AS she INNER JOIN establecimiento AS est ON est.id_establecimiento = she.id_establecimiento INNER JOIN establecimiento_user AS est_usr ON est_usr.id_establecimiento = est.id_establecimiento WHERE est_usr.id_user = ?', [id_user]);
        res.render('schedules/list', {schedules});
    }else{
        res.status(401);
        res.render('partials/errors/route');
    } 
});

//Ruta para crear nuevos horarios en el sistema
router.get('/create', isLoggedIn, async (req, res) => {
    if(req.user.id_profile == 2){
        const id_user = req.user.id_user;
        establishment = await pool.query('SELECT * FROM establecimiento AS est INNER JOIN establecimiento_user AS est_usr ON est_usr.id_establecimiento = est.id_establecimiento WHERE est_usr.id_user = ?', [id_user]);
        res.render('schedules/create', {establishment});
    }else{
        res.status(401);
        res.render('partials/errors/route');
    }
});

//Ruta para guardar un nuevo horario
router.post('/save', isLoggedIn, async (req, res) => {
    if(req.user.id_profile == 2){
        let data = req.body;
        let created_at = new Date();
        let status_schedule = 4;
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
    }else{
        res.send(false);
    }
});

//Ruta para actualizar un horario
router.post('/update', isLoggedIn, async (req, res) => {
    if(req.user.id_profile == 2){
        let data = req.body;
        let updated_at = new Date();
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
            end_hour_sunday,
            id_schedule,
            id_schedule_detail} = data;

        const newSchedule = {
            id_establecimiento,
            name_schedule,
            description_schedule,
            updated_at
        };

        const schedule_name = await pool.query('SELECT name_schedule FROM schedule WHERE name_schedule = ? AND id_establecimiento = ? AND id_schedule != ?', [name_schedule, id_establecimiento, id_schedule]);
        if(schedule_name.length > 0){
            return res.send('schedule_name');
        }else{
            const query_schedule = await pool.query('UPDATE schedule SET ? WHERE id_schedule = ?', [newSchedule, id_schedule]);
            const newSceduleDetail = {
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
            const query_schedule_detail = await pool.query('UPDATE schedule_detail SET ? WHERE id_schedule_detail = ?', [newSceduleDetail, id_schedule_detail]);
            if(query_schedule_detail){
                res.send(true);
            }else{
                res.send(false);
            }
        }
    }else{
        res.send(false);
    }
});

//Ruta para obtener los datos al detalle del establecimiento
router.get('/detail/:id', isLoggedIn, async (req, res) => {
    if(req.user.id_profile == 2){
        const { id } = req.params;
        const schedules = await pool.query('SELECT * FROM schedule AS she INNER JOIN schedule_detail AS she_det ON she_det.id_schedule = she.id_schedule INNER JOIN establecimiento as est ON est.id_establecimiento = she.id_establecimiento WHERE she.id_schedule = ? ORDER BY she.created_at desc', [id]);
        const data = schedules[0];
        res.json(data);
    }else{
        const data = "";
        res.json(data);
    }
});



module.exports = router;