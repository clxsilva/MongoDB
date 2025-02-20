/**
 * Processo principal
 * Estudo do CRUD com MongoDB
 */

// importação do módulo de coneção (database.js)
const { conectar, desconectar } = require('./database.js')

// importação do modelo de dados de clientes
const clienteModel = require('./src/models/clientes.js')

// CRUD Create (função para adicionar um novo cliente)
const criarCliente = async (nomeCli, foneCli) => {
    try {
        const novoCliente = new clienteModel(
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli
            }
        )
        // a linha abaixo salva os dados do cliente no banco
        await novoCliente.save()
        console.log("Cliente adicionado com sucesso.")
    } catch (error) {
        console.log(error)
    }
}

// execução da aplicação
const app = async () => {
    await conectar()
    await criarCliente("Yvis da Massa", "1193541-6121")
    await desconectar()
}

console.clear()
app()