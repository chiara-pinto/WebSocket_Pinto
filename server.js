const fs = require('fs');
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { Server } = require('socket.io'); // importazione oggetto Server da socket.io
const conf = JSON.parse(fs.readFileSync("./conf.json"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use("/", express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const io = new Server(server);
server.listen(conf.port, () => {
  console.log("server avviato sulla porta: " + conf.port);
});

const listaUtenti = [];

io.on('connection', (socket) => {
  console.log("socket connessa: " + socket.id);
  socket.on("nome", (nome) => {
    listaUtenti.push({
      socketId: socket.id,
      nome: nome
    });
    io.emit("chat", nome + " si è unito alla chat.");
    io.emit("lista", listaUtenti);
  });
  
  socket.on("messaggio", (messaggio) => {
    const utente = listaUtenti.find(u => u.socketId === socket.id);
    let nome ="Sconosciuto";
    if (utente != undefined){
      nome=utente.nome
    }
    const risposta = nome + ": " + messaggio;
    console.log(risposta);
    io.emit("chat", risposta);
  });

  socket.on("list", () => {
    socket.emit("lista", listaUtenti);
  });

  socket.on("disconnect", () => {
    const indice = listaUtenti.findIndex(u => u.socketId === socket.id);
    if (indice !== -1) {
      const nome = listaUtenti[indice].nome;
      listaUtenti.splice(indice, 1);
      io.emit("chat", nome + " ha abbandonato la chat.");
      io.emit("lista", listaUtenti);
    }
  });
});