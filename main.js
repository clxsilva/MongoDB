/**
 * Processo principal
 * Estudo do CRUD com MongoDB
 */

// importação do módulo de coneção (database.js)
const { trusted } = require('mongoose')
const { conectar, desconectar } = require('./database.js')

// importação do modelo de dados de clientes
const clienteModel = require('./src/models/clientes.js')

// importação do pacote string-similarity para aprimorar a busca por nome
const stringSimilarity = require('string-similarity')

// CRUD Create (função para adicionar um novo cliente)
const criarCliente = async (nomeCli, foneCli, cpfCli) => {
    try {
        const novoCliente = new clienteModel(
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpf: cpfCli
            }
        )
        // a linha abaixo salva os dados do cliente no banco
        await novoCliente.save()
        console.log("Cliente adicionado com sucesso.")
    } catch (error) {
        // tratamento de exceções específicas
        if (error.code = 11000) {
            console.log(`Erro: O CPF ${cpfCli} já está cadastrado`)
        } else {
            console.log(error)
        }
    }
}

// CRUD Read - Função parea listar todos os clientes cadastrados
const listarClientes = async () => {
    try {
        // a linha abaixo lista todos os clientes cadastrados
        const clientes = await clienteModel.find().sort(
            {
                nomeCliente: 1
            }
        )
        console.log(clientes)
    } catch (error) {
        console.log(error)
    }
}

// CRUD Read - Função para buscar um cliente especifico
const buscarCliente = async (nome) => {
    try {
        // find() buscar
        // nomeClientes: new RegExp(nome) filtro pelo nome
        // 'i' insensitive (ignorar letras maiúsculas ou minúsculas)
        const cliente = await clienteModel.find(
            {
                nomeCliente: new RegExp(nome, 'i')
            }
        )
        // calcular a similaridade entre os nomes retornnados e o nome pesquisado
        const nomesClientes = cliente.map(cliente => cliente.nomeCliente)
        // validação (se não existir o cliente pesquisado)
        if (nomesClientes.length === 0) {
            console.log("Cliente não cadastrado")
        } else {
            const match = stringSimilarity.findBestMatch(nome, nomesClientes)

            // cliente com melhor similaridade
            const melhorCliente = cliente.find(cliente => cliente.nomeCliente === match.bestMatch.target)
            //formatação da data 
            const clienteFormatado = {
                nomeCliente: melhorCliente.nomeCliente,
                foneCliente: melhorCliente.foneCliente,
                cpf: melhorCliente.cpf,
                dataCadastro: melhorCliente.dataCadastro.toLocaleDateString('pt-BR')
            }
            console.log(clienteFormatado)
        }

    } catch (error) {
        console.log(error)
    }
}

// Crud Update - Função para alterar os dados de um cliente 
// ATENÇÃo !!! Obrigatoriamente o update precisa ser feito com base no ID do cliente
const atualizarCliente = async (id, nomeCli, foneCli, cpfCli) => {
    try {
        const cliente = await clienteModel.findByIdAndUpdate(
            id,
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpf: cpfCli
            },
            {
                new: true,
                runValidators: true
            }
        )
        // validação (retorno do banco)
        if (!cliente) {

        }
    } catch (error) {
        console.log(error)
    }
}

// CRUD Delete - Função para excluir um cliente
// ATENÇÃO !!! Obrigatoriamente a exclusão é feita pelo ID
const deletarCliente = async (id) => {
    try {
        // a linha abaixo exclui o cliente do banco de dados
        const cliente = await clienteModel.findByIdAndDelete(id)
        // validação
        if (!cliente) {
            console.log("Cliente não encontrado")
        } else {
            console.log("Cliente deletado")
        }
    } catch (error) {
        console.log(error)
    }
}

// execução da aplicação
const app = async () => {
    await conectar()

    // CRUD - Create
    //await criarCliente("Yvis Trindade", "1193541-6121", "123.456.789-02")
    //await criarCliente("Gabriel Yago", "1195198--8454", "123.456.789-03")

    // CRUD - Read (Exemplo 1 - listar cliente)
    //await listarClientes()

    // CRUD - Read (Exemplo 2 - buscar cliente pelo nome)
    //await buscarCliente("Yvis Trindade")

    // CRUD - Update
    //await atualizarCliente('67be4fa9e33a1f504393601a', 'Yvis Trindade', "1198888-8888", "999.999.999-99")

    await buscarCliente("Yvis Trindade")

    //await deletarCliente("")

    await desconectar()
}

console.clear()
app()