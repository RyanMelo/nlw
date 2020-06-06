const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db.js")

//Configurar pasta publica
server.use(express.static("public"))

// habilita  o uso do req.body
server.use(express.urlencoded({extended: true}))

// Utilizando template engine (com nunjuncks)
const nunjuncks = require("nunjucks")
nunjuncks.configure("src/views", {
    express: server,
    noCache: true
})


//configurar os caminhos
// pagina inicial
// req: Requisicao
// res: Resposta
server.get("/", (req, res) => {
    return res.render("index.html", { title: "Um Titulo" })
})

server.get("/create-point", (req, res) => {
   
    //req.query: Query Strings da nossa url
    // console.log(req.query)


    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    
    //reqq.body: o corpo do nosso formulario
    // console.log(req.body)
    
    //inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.images,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsetData(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no cadastro")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsetData)
})


server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "") {
        //pesquisa fazia
        return res.render("search-results.html", {total: 0})
    } 
    


    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length
        
        //mostrar a pagina html com os dados do banco de dados
        return res.render("search-results.html", {places: rows, total: total})
    })
})

//ligar o server
server.listen(3000)
