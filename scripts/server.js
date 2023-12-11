import express from 'express'
import Sequelize from 'sequelize'
const Op = Sequelize.Op

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'my.db'
})

const Professor = sequelize.define('professor', {
    name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
            len: [1, 20]
        }
    },
    surname: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
            len: [1, 20]
        }
    },
    password: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
            is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]*$/i, // minimum 1 number included
            len: [6, 20]
        }
    }
})

const Activity = sequelize.define('activity', {
    name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            len: [5, 100]
        }
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isDate: true,
            isAfter: new Date().toISOString()
        }
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            len: [1, 100]
        }
    },
    uniqueCode: {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: {
            len: [5, 30]
        }
    },
    timeLimit: Sequelize.INTEGER
})

const Student = sequelize.define('student', {
    name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
            len: [1, 20]
        }
    },
    surname: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
            len: [1, 20]
        }
    },
    password: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
            is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]*$/i,
            len: [6, 20]
        }
    }
})

Professor.hasMany(Activity)
Activity.belongsTo(Professor)

Student.belongsToMany(Activity, { through: "studentActivity" })
Activity.belongsToMany(Student, { through: "studentActivity" })

await sequelize.sync({ alter: true })

const app = express()

app.use(express.json())

// Post for professor - called when creating account
app.post('/professors/signup', async (req, res, next) => {
    try {
        const savedProfessor = await Professor.create(req.body)
        res.status(201).json(savedProfessor)
    } catch (error) {
        next(error)
    }
})

// Get for professors - to test if we have our professors
app.get('/professors', async (req, res, next) => {
    try {
        const professors = await Professor.findAll()
        res.status(200).json(professors)
    } catch (error) {
        next(error)
    }
})

// Get for one professor based on id
app.get('/professors/:pid', async (req, res, next) => {
    try {
        const professor = await Professor.findByPk(req.params.uid)
        if (professor) {
            res.status(200).json(professor)
        } else {
            res.status(404).json({ message: 'Professor not found' })
        }
    } catch (error) {
        next(error)
    }
})

// Post for student - called when creating account
app.post('/students/signup', async (req, res, next) => {
    try {
        const savedStudent = await Student.create(req.body)
        res.status(201).json(savedStudent)
    } catch (error) {
        next(error)
    }
})

// Get for students - to test if we have our students
app.get('/students', async (req, res, next) => {
    try {
        const students = await Student.findAll()
        res.status(200).json(students)
    } catch (error) {
        next(error)
    }
})

// Get for activities
app.get('/activities', async (req, res, next) => {
    try {
        const activities = await Activity.findAll()
        res.status(200).json(activities)
    } catch (error) {
        next(error)
    }
})

// Post for activity - called when creating activity
app.post('/professors/:pid/activities', async (req, res, next) => {
    try {
        const professor = await Professor.findByPk(req.params.pid)
        if (professor) {
            const activity = new Activity(req.body)
            activity.professorId = professor.id
            await activity.save()
            res.status(201).json(activity)
        } else {
            res.status(404).json({ message: 'Activities not found' })
        }
    } catch (error) {
        next(error)
    }
})

app.get('/professors/:pid/activities', async (req, res, next) => {
    try {
        const professor = await Professor.findByPk(req.params.pid, { include: [Activity] })
        if (professor) {
            res.status(200).json(professor.activities)
        } else {
            res.status(404).json({ message: 'Activities not found' })
        }
    } catch (error) {
        next(error)
    }
})

// // Get for individual activity - called when inserting a code for an activity
// app.get('/activity', async (req, res, next) => {
//     try {
//         const professor = await Professor.findByPk(req.params.pid, { include: [Activity] })
//         if (professor) {
//             res.status(200).json(professor.activities)
//         } else {
//             res.status(404).json({ message: 'Activities not found' })
//         }
//     } catch (error) {
//         next(error)
//     }
// })


// Delete for professors
app.delete('/professors/:pid', async (req, res, next) => {
    try {
        const professor = await Professor.findByPk(req.params.pid)
        if (professor) {
            await professor.destroy()
            res.status(200).json({ message: 'Professor deleted' })
        }
        else {
            res.status(404).json({ message: 'Professor not found' })
        }
    } catch (error) {
        next(error)
    }
})

// Delete for students
app.delete('/students/:sid', async (req, res, next) => {
    try {
        const student = await Student.findByPk(req.params.sid)
        if (student) {
            await student.destroy()
            res.status(200).json({ message: 'Student deleted' })
        }
        else {
            res.status(404).json({ message: 'Student not found' })
        }
    } catch (error) {
        next(error)
    }
})

// Delete for activities
app.delete('/professors/:pid/activities/:aid', async (req, res, next) => {
    try {
        const results = await Activity.destroy({
            where: {
                id: req.params.aid,
                professorId: req.params.pid
            }
        })
        if (results) {
            res.status(202).json({ message: 'Activity deleted' })
        } else {
            res.status(404).json({ message: 'Not found' })
        }
    } catch (error) {
        next(error)
    }
})

// // Intermediary table
// app.post('/students/:sid/studentActivity', async (req, res, next) => {
//     try {
//         const student = await Student.findByPk(req.params.sid)
//         const activity = await Activity.findByPk(req.body.aid)
//         if (student && activity) {
//             await student.addActivity(activity)
//             res.status(201).json({ message: 'Enrolled' })
//         } else {
//             res.status(404).json({ message: 'Not found' })
//         }
//     } catch (error) {
//         next(error)
//     }
// })

// app.get('/students/:sid/studentActivity', async (req, res, next) => {
//     try {
//         const student = await Student.findByPk(req.params.sid)
//         const activity = await Activity.findByPk(req.body.aid)
//         if (student && activity) {
//             res.status(200).json(student.studentActivity)
//         } else {
//             res.status(404).json({ message: 'Activities not found' })
//         }
//     } catch (error) {
//         next(error)
//     }
// })

// app.post('/activities/:aid/studentActivity', async (req, res, next) => {
//     try {
//         const activity = await Activity.findByPk(req.params.aid)
//         const student = await Student.findByPk(req.body.sid)
//         if (activity && student) {
//             await activity.addStudent(student)
//             res.status(201).json({ message: 'Enrolled' })
//         } else {
//             res.status(404).json({ message: 'Not found' })
//         }
//     } catch (error) {
//         next(error)
//     }
// })

// Modify professor
app.put('/professors/:pid', async (req, res, next) => {
    try {
        const results = await Professor.update(req.body, {
            where: {
                id: req.params.pid,
            },
            fields: ['name', 'surname', 'password']
        })
        console.warn(results)
        if (results.shift()) {
            res.status(202).json({ message: 'Success' })
        } else {
            res.status(404).json({ message: 'Not found' })
        }
    } catch (error) {
        next(error)
    }
})

// Modify student
app.put('/students/:sid', async (req, res, next) => {
    try {
        const results = await Student.update(req.body, {
            where: {
                id: req.params.sid,
            },
            fields: ['name', 'surname', 'password']
        })
        console.warn(results)
        if (results.shift()) {
            res.status(202).json({ message: 'Success' })
        } else {
            res.status(404).json({ message: 'Not found' })
        }
    } catch (error) {
        next(error)
    }
})

// Modify activity
app.put('/professors/:pid/activities/:aid', async (req, res, next) => {
    try {
        const results = await Activity.update(req.body, {
            where: {
                id: req.params.pid,
                activityId: req.params.aid
            },
            fields: ['name', 'date', 'description', 'timeLimit']
        })
        console.warn(results)
        if (results.shift()) {
            res.status(202).json({ message: 'Success' })
        } else {
            res.status(404).json({ message: 'Not found' })
        }
    } catch (error) {
        next(error)
    }
})

app.use((err, req, res, next) => {
    console.warn(err)
    res.status(500).json({ message: 'Error' })
})

app.listen(7777)