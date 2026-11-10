const placar = document.getElementById("placar");
const total = document.getElementById("total");
const textoTotal = document.getElementById("texto-total");
const alerta = document.getElementById("alerta");
const btnZerar = document.getElementById("btn-zerar");
const btnConfirmarZerar = document.getElementById("btn-confirmar-zerar");
const modalZerar = document.getElementById("modalZerar");

function contarVotos(votos, participanteId) {
  let quantidade = 0;
  for (const voto of votos) {
    if (String(voto.participanteId) === String(participanteId)) {
      quantidade++;
    }
  }
  return quantidade;
}

function criarLinha(participante, percentual, maisVotado) {
  let classeCard = "card card-fazenda mb-3";
  let classeBarra = "progress-bar bg-dark";
  let badge = "";

  if (maisVotado) {
    classeCard += " border-danger";
    classeBarra = "progress-bar bg-danger";
    badge = `<span class="badge bg-danger ms-2">Sairia hoje</span>`;
  }

  let textoVotos = participante.votos === 1 ? "1 voto" : `${participante.votos} votos`;

  return `
    <div class="${classeCard}">
      <div class="card-body d-flex align-items-center gap-3">
        <img src="${participante.foto}" alt="Foto de ${participante.nome}"
             class="rounded object-fit-cover" width="120" height="80">
        <div class="flex-grow-1">
          <h2 class="h5 titulo-card mb-2">${participante.nome}${badge}</h2>
          <div class="progress" role="progressbar" aria-label="Votos de ${participante.nome}"
               aria-valuenow="${percentual}" aria-valuemin="0" aria-valuemax="100">
            <div class="${classeBarra}" style="width: ${percentual}%"></div>
          </div>
          <small class="d-block mt-1">${percentual}% (${textoVotos})</small>
        </div>
      </div>
    </div>`;
}

function mostrarSemVotos() {
  placar.innerHTML = `
    <div class="card card-fazenda text-center">
      <div class="card-body p-4">
        <p class="mb-3">Nenhum voto ainda. Escolha quem sai da roça para ver a parcial.</p>
        <a href="votacao.html" class="btn btn-danger">Ir para a votação</a>
      </div>
    </div>`;
  btnZerar.classList.add("d-none");
}

async function carregarResultado() {
  try {
    const votos = await buscarVotos();
    const roca = await buscarParticipantesDaRoca();

    total.textContent = votos.length;
    textoTotal.textContent = votos.length === 1 ? "voto computado" : "votos computados";

    if (votos.length === 0) {
      mostrarSemVotos();
      return;
    }

    const lista = [];
    for (const participante of roca) {
      lista.push({
        nome: participante.nome,
        foto: participante.foto,
        votos: contarVotos(votos, participante.id)
      });
    }


    lista.sort((a, b) => b.votos - a.votos);

    let html = "";
    for (let i = 0; i < lista.length; i++) {
      const percentual = ((lista[i].votos / votos.length) * 100).toFixed(1);
      html += criarLinha(lista[i], percentual, i === 0);
    }

    placar.innerHTML = html;
    btnZerar.classList.remove("d-none");
  } catch (erro) {
    console.error(erro);
    alerta.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Não foi possível carregar o resultado. O JSON Server está rodando (npm start)?
      </div>`;
  }
}

async function zerarVotacao() {
  btnConfirmarZerar.disabled = true;

  try {
    const votos = await buscarVotos();


    for (const voto of votos) {
      await apagarVoto(voto.id);
    }
  } catch (erro) {
    console.error(erro);
    alerta.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Não foi possível zerar a votação. Tente de novo.
      </div>`;
  }

  bootstrap.Modal.getOrCreateInstance(modalZerar).hide();
  btnConfirmarZerar.disabled = false;
  carregarResultado();
}

btnConfirmarZerar.addEventListener("click", zerarVotacao);

carregarResultado();