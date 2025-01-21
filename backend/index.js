const express = require('express')
const morgan = require('morgan')
const app = express()

let persons = [
    {
        id: "1",
        name: "Faith Collins",
        number: "393-76728727"
    },
    {
        id: "2",
        name: "Bekka William",
        number: "934 67589302"
    },
    {
        id: "3",
        name: "Peter Dallas",
        number: "47- 3456272"
    },
    {
        id: "4",
        name: "Bella Steven",
        number: " 934 67567534"
    },
    {
        id: "5",
        name: "Veritas Sam",
        number: "2348057266596"
    },
    {
        id: "6",
        name: "Stella Forest",
        number: "234-5738282911"
    }
]

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

app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Welcome to Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const numberOfEntries = persons.length
    const requestTime = new Date()

    response.send(
        `<p>Phonebook has info for ${numberOfEntries} people</p>
        <p>${requestTime}</p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

     if (person) {
        response.json(person) 
     } else {
        response.status(404).end()
     } 
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 1000000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})