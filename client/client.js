const campoNome = document.getElementById("campoNome");
const bottoneNome = document.getElementById("bottoneNome");
const campoMessaggio = document.getElementById("campoMessaggio");
const bottoneInvia = document.getElementById("bottoneInvia");
const chat = document.getElementById("chat");
const utenti = document.getElementById("utenti");

const modelloMessaggio = "<li class=\"list-group-item\">%MESSAGGIO</li>";
const modelloUtente = "<li class=\"list-group-item\">%NOME</li>";
const messaggi = [];

const socket = io();

const mostraModale = new bootstrap.Modal(document.getElementById("modaleNome"));
mostraModale.show();

bottoneNome.onclick = () => {
  const nome = campoNome.value;
  socket.emit("nome", nome);
  mostraModale.hide();
}

campoMessaggio.onkeydown = (evento) => {
  if (evento.keyCode === 13) {
    evento.preventDefault();
    bottoneInvia.click();
  }
}

bottoneInvia.onclick = () => {
  socket.emit("messaggio", campoMessaggio.value);
  campoMessaggio.value = "";
}

socket.on("chat", (messaggio) => {
  messaggi.push(messaggio);
  disegnaChat();
});

socket.on("lista", (lista) => {
  disegnaLista(lista);
});

const disegnaChat = () => {
  let html = "";
  messaggi.forEach((m) => {
    const riga = modelloMessaggio.replace("%MESSAGGIO", m);
    html += riga;
  });
  chat.innerHTML = html;
  window.scrollTo(0, document.body.scrollHeight);
}

const disegnaLista = (lista) => {
  let html = "";
  lista.forEach((u) => {
    const riga = modelloUtente.replace("%NOME", u.nome);
    html += riga;
  });
  utenti.innerHTML = html;
}