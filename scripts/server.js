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
            isAfter: Date.now()
        }
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            isInt: true,
            min: 1000
        }
    },
    uniqueCode: {
        type: Sequelize.STRING(10),
        allowNull: false,
        validate: {
            len: [5, 10]
        }
    },
    timeLimit: Sequelize.INTEGER
})

// Professor.hasMany(Activity)
// Student.belongsToMany(Activity)

await sequelize.sync({ alter: true })

const app = express()

app.use(express.json())

// Post for professor - called when creating account
app.post('/professor/signup', async (req, res, next) => {
    try {
        const savedProfessor = await Professor.create(req.body)
        res.status(201).json(savedProfessor)
    } catch (error) {
        next(error)
    }
})

// Post for student - called when creating account
// app.post('/student/signup', async (req, res, next) => {
//     try {
//         const savedStudent = await Student.create(req.body)
//         res.status(201).json(savedStudent)
//     } catch (error) {
//         next(error)
//     }
// })

// Post for activity - called when creating activity
app.post('/professor/:pid/activities', async (req, res, next) => {
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

app.get('/professor/:pid/activities', async (req, res, next) => {
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

app.use((err, req, res, next) => {
    console.warn(err)
    res.status(500).json({ message: 'Error' })
})

app.listen(7777)