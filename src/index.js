const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

/* para entender quando eu enviar uma requisição para a API em JSON */
app.use(express.json())

/* para entender quando eu passar parametros na minha url */
app.use(express.urlencoded({ extended: false }))

require('./app/routes/index')(app)

app.listen(3030) // rodando na porta 3030
