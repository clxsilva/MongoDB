/**
 * Processo principal
 * Estudo do CRUD com MongoDB
 */

// importação do módulo de coneção (database.js)
const {conectar, desconectar} = require('./database')

// execução da aplicação
const app = async () => {
    await conectar()
    await desconectar()
}

console.clear()
app()