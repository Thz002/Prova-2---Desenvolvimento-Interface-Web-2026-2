const API_URL = "http://localhost:3000";

async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(API_URL + caminho, opcoes);

  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} ao acessar ${caminho}`);
  }

  return resposta.json();
}

function buscarParticipantesDaRoca() {
  return requisicao("/participantes?naRoca=true");
}

function buscarDemaisPeoes() {
  return requisicao("/participantes?naRoca=false");
}

function buscarVotos() {
  return requisicao("/votos");
}

function registrarVoto(participanteId) {
  return requisicao("/votos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      participanteId: participanteId,
      data: new Date().toISOString() 
    })
  });
}

function apagarVoto(id) {
  return requisicao(`/votos/${id}`, { method: "DELETE" });
}