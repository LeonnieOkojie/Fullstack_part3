const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('dist'))

let persons = [ 
]

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('---')
    next()
}

app.use(cors())
app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Welcome to Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const numberOfEntries = persons.length
        const requestTime = new Date()
        response.send(
            `<p>Phonebook has info for ${numberOfEntries} people</p>
            <p>${requestTime}</p>`
        )
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})
// delete request for deleting a person from the phonebook
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(person => {
            if (person) {
                response.json({ person, message: 'deleted successfully' })
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error)) 
})
// post request for adding a new person to the phonebook
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    Person.findOne({ name: person.name}) // checks if the name already exists
        .then(existingPerson => {
            if (existingPerson) {
                return response.status(400).json({ message : 'Name already exists' })
            }

            person.save() 
                .then(result => {
                    console.log(result)
                    response.json(person)
                }).catch(error => next(error))
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }
    
    Person.findByIdAndUpdate( 
        request.params.id, 
        person, 
        { new: true, runValidators: true, context: 'query' } // returns the updated document
    )
        .then(updatedPerson => {
            response.json(updatedPerson) //returns the updated person
        })
        .catch(error => next(error))
})
// Error handling middleware 
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => { 
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error) // passes the error to the default express handler
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})