const cardsRoca = document.getElementById("cards-roca");
const cardsPeoes = document.getElementById("cards-peoes");
const alerta = document.getElementById("alerta");

let participantesDaRoca = [];

function criarCardRoca(participante) {
  return `
    <div class="col">
      <div class="card card-fazenda h-100 position-relative overflow-hidden">
        <span class="badge bg-danger position-absolute top-0 end-0 m-2 z-1">Na roça</span>

        <div class="ratio ratio-4x3">
          <img src="${participante.foto}" class="card-img-top object-fit-cover"
               alt="Foto de ${participante.nome}">
        </div>

        <div class="card-body text-center">
          <h3 class="card-title h5 titulo-card">${participante.nome}</h3>
          <button type="button" class="btn btn-danger w-100 btn-votar"
                  data-id="${participante.id}">
            Votar para eliminar
          </button>
        </div>
      </div>
    </div>`;
}


function criarCardPeao(participante) {
  return `
    <div class="col">
      <div class="card card-fazenda h-100 overflow-hidden">
        <div class="ratio ratio-1x1">
          <img src="${participante.foto}" class="card-img-top object-fit-cover"
               alt="Foto de ${participante.nome}">
        </div>
        <div class="card-body p-2 text-center">
          <p class="card-text small fw-semibold mb-0">${participante.nome}</p>
        </div>
      </div>
    </div>`;
}

function mostrarAlerta(tipo, mensagem, comLink = false) {
  const link = comLink
    ? `<a href="resultado.html" class="alert-link ms-auto me-4 text-nowrap">Ver resultado</a>`
    : "";

  alerta.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show d-flex align-items-center" role="alert">
      <span>${mensagem}</span>
      ${link}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    </div>`;
}



async function carregarParticipantes() {
  try {
    const [roca, peoes] = await Promise.all([
      buscarParticipantesDaRoca(), 
      buscarDemaisPeoes()          
    ]);

    participantesDaRoca = roca;

    cardsRoca.innerHTML = roca.map(criarCardRoca).join("");
    cardsPeoes.innerHTML = peoes.map(criarCardPeao).join("");
  } catch (erro) {
    console.error(erro);
    mostrarAlerta("danger", "Não foi possível carregar os participantes. O JSON Server está rodando (npm start)?");
  }
}

cardsRoca.addEventListener("click", async (evento) => {
  const botao = evento.target.closest(".btn-votar");
  if (!botao) return; 

  const participante = participantesDaRoca.find(
    (p) => String(p.id) === botao.dataset.id
  );
  if (!participante) return;

  botao.disabled = true; 

  try {
    await registrarVoto(participante.id); 


    const votos = await buscarVotos();
    const total = votos.length;

    mostrarAlerta(
      "success",
      `Voto registrado para eliminar <strong>${participante.nome}</strong>. ` +
      `Você já votou ${total} ${total === 1 ? "vez" : "vezes"}.`,
      true
    );
  } catch (erro) {
    console.error(erro);
    mostrarAlerta("danger", "Não foi possível registrar o voto. Tente de novo.");
  } finally {
    botao.disabled = false; 
  }
});


carregarParticipantes();