
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use('/api/preguntas', require('./routes/preguntas'))

app.listen(3001, () => console.log('Servidor corriendo en http://localhost:3001'))
