/**
 * 
 * Arquivo inicial da aplicação desenvolvida para N2 de lingaugem de programação III 
 */


//importando pacotes

const express = require("express");
const app = express();

const bodyParser = require("body-parser");

//config para uso do bodyParser
app.use(bodyParser.urlencoded({extended: false}));
//conversão para requisção JSON
app.use(bodyParser.json());

//import cors
const cors = require("cors");

//import mongoose
const mongoose = require("mongoose");

//string de conexão com o MongoBD 

const uri = 
    "mongodb+srv://thiagolivramento:<senha>@cluster0.nxdfb.mongodb.net/nome_da_base?retryWrites=true&w=majority";

mongoose
  .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() =>{
    console.log("Conexão realizada!");
  })
  .catch((error)=>{
    console.log(error);
  });

//import user
var User = require("./modelos/user");
var Sala = require("./modelos/sala");

//server da aplicação
var port = 4000;

//definição para usar instancias de rotas do express
var router = express.Router();

//Definição de middleware para acessar solicitações enviadas - API
router.use(function(req, res, next) {
  console.log("Pagina inicial do middleware");
  //definindo site de origem. O * permite qualquer site faça conexão.
  //Coloque uma URL do front no lugar do *, caso existir.
  res.header("Access-Control-Allow-Origin", "*");
  //definindo os metodos
  res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
  //config do cors
  app.use(cors());
  next();
});

//rota raiz 
app.get("/", (req, res) => {
res.send("Bem vindo a nossa aplicação.");
}); 

app.get("/test",(req,res) => {
res.send("Apenas um teste!")
});

/**
 * Rota de verificação da API
 */
router.get("/", function(req, res){
   res.json({
     message: "Acesso a aplicação."
   });
});

/**
 * rotas vinculadas ao modelo user, terminadas em /users (acesso: POST e GET)
 */
router
   .route("/users")

/**
 * POST - cadastro do usuário na aplicação
 * http://localhost:4000/api/users
 */
.post(function(req, res) {
  var user = new User();
  user.name = req.body.name;
  user.sobrenome = req.body.sobrenome;
  /*user.senha = req.body.senha;*/

  user.save(function (error){
    if (error) res.send(error);
    res.json({ message: "usuário cadastrado na base de dados"});
  });
})

/**
 * GET - retornar lista de usuários da aplicação
 * http://localhost:4000/api/users
 */
.get(function(req, res){
  User.find(function (error, users) {
    if (error) res.send(error);
    res.json(users);
  });
});

//Rotas terminadas em '/users/:id' (rotas acessadas pelos verbos GET, PUT e DELETE)
router
  .route("/users/:id")

  /**
   * Método GET: retornar um usuário específico pelo id
   * Acesso: GET http://localhost:4000/api/users/:id
   */
  .get(function (req, res) {
    User.findById(req.params.id, function (error, user) {
      if (error) res.send(error);
      res.json(user);
    });
  })

  /**
   * Método PUT: atualizar um usuário específico pelo id
   * Acesso: PUT http://localhost:4000/api/users/:id
   */
  .put(function (req, res) {
    User.findById(req.params.id, function (error, user) {
      if (error) res.send(error);
      //A solicitação os dados para serem validados pelo esquema 'user'
      user.name = req.body.name;
      user.sobrenome = req.body.sobrenome;
      /*user.senha = req.body.senha;*/
      user.save(function (error) {
        if (error) res.send(error);
        res.json({ message: "Usuário atualizado com sucesso!" });
      });
    });
  })

  /**
   * Método DELTE: excluir um usuário específico pelo id
   * Acesso: DELETE http://localhost:4000/api/users/:id
   */

  .delete(function (req, res) {
    User.remove(
      {
        _id: req.params.id
      },
      function (error) {
        if (error) res.send(error);
        res.json({ message: "Usuário excluído com sucesso!" });
      }
    );
  });


//rota para acessar
router
.route("/salas")


/**
 * Metodo POST: cadastrar uma sala
 * Acesso: http://localhost:4000/api/sala
 */

 .post(function(req, res) {
    var sala = new Sala();
    sala.name = req.body.name;
    sala.lotacao = req.body.lotacao;

    sala.save(function (error) {
      if (error) res.send(error);
      res.json({ message: "Sala cadastrada!"});
    });
 })

/**
 * Método GET: retorna a lista de salas
 * Acesso: GET http://localhost:4000/api/sala
 */

 .get(function(req, res) {
   Sala.find(function (error, salas) {
     if (error) res.send(error);
     res.json(salas);
   });
 });

 //rotas terminadas em '/salas/:id' (rotas dos verbos GET, PUT e DELETE)
 router
   .route("/sala/:id")

/**
 * Método GET: retorna uma sala específica pelo id
 * Acesso: GET http://localhost:4000/api/salas/:id
 */
.get(function(req, res){
  Sala.findById(req.params.id, function (error, sala){
    if (error) res.send(error);
    res.json(sala);
  });
})


/**
 * Método PUT: atualização de uma sala específica por id
 * Acesso: PUT http://localhost:4000/api/salas/:id
 */
.put(function(req, res){
  Sala.findById(req.params.id, function(error, sala){
     if (error) res.send(error);
     //solicitação de dados para serem validados pelo schema 'sala'
     sala.name = req.body.name;
     sala.lotacao = req.body.lotacao;
     sala.save(function(error){
       if (error) res.send(error);
       res.json({message: "Sala atualizada com sucesso!"});
     });
  });
})

/**
 * Método DELETE: excluir uma sala específica pelo id
 * Acesso: DELETE http://localhost:4000/api/salas/:id
 */
.delete(function(req, res){
   Sala.remove(
    {
      _id:req.params.id
    },
    function (error) {
      if(error) res.send(error);
      res.json({message: "Sala excluída!"});
    }
   );
});

app.use("/api", router);


app.listen(port);
console.log("Iniciando a aplicação na porta " + port);
