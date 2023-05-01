const express = require('express');
const router = express.Router();
const todos = require('../models/express-models/todos');
const { Task, Owner} = require('../models/sequelize-models/index')
module.exports = router;

// write your routes here. Feel free to split into multiple files if you like.

router.get('/users', async (req, res, next) => {
    try {
        const users = todos.listPeople();
        res.send(users);
    } catch (error) {
        next(error);
    }
})

router.get('/users/:name/tasks', async (req, res, next) => {
    try {
        if (!todos.list(req.params.name)){
            res.status(404).send('Not Found')
        }
        else {
            const tasks = todos.list(req.params.name);
            res.send(tasks);
        }
    } catch (error) {
        next(error);
    }
})

//EXTRA CREDIT ROUTES - EACH WORKS WHEN UNCOMMENTED & OTHER "/users/:name/tasks" ROUTES ARE COMMENTED

//1
// router.get('/users/:name/tasks', async (req, res, next) => {
//     try {
//         if (!todos.list(req.params.name)){
//             res.status(404).send('Not Found')
//         }
//         else {
//             const tasks = todos.list(req.params.name);
//             const completedTasks = tasks.filter(task => task.complete == true)
//             res.send(completedTasks);
//         }
//     } catch (error) {
//         next(error);
//     }
// })

//2
// router.get('/users/:name/tasks', async (req, res, next) => {
//     try {
//         if (!todos.list(req.params.name)){
//             res.status(404).send('Not Found')
//         }
//         else {
//             const tasks = todos.list(req.params.name);
//             const uncompletedTasks = tasks.filter(task => task.complete !== true)
//             console.log(uncompletedTasks)
//             res.send(uncompletedTasks);
//         }
//     } catch (error) {
//         next(error);
//     }
// })

router.post('/users/:name/tasks', async (req, res, next) => {
    try {
        if (!req.body.content){
            res.status(400).send('Not Found')
        }
        else {
            todos.add(req.params.name, req.body);
            const tasks = todos.list(req.params.name)
            console.log(tasks)
            res.status(201).json(tasks[0])
        }
    } catch (error) {
        next(error);
    }
})

router.put('/users/:name/tasks/:index', async(req, res, next) => {
    try {
        todos.complete(req.params.name, req.params.index);
        res.send()
    } catch (error) {
        next(error);
    }
})

router.delete('/users/:name/tasks/:index', async(req, res, next) => {
    try {
        todos.remove(req.params.name, req.params.index);
        res.status(204).send()
    } catch (error) {
        next(error);
    }
})