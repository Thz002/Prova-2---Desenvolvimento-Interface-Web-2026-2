
const chipsRoca = document.getElementById("chips-roca");
const infoPeoes = document.getElementById("info-peoes");
const alerta = document.getElementById("alerta");


function criarChip(participante) {
  return `
    <a href="votacao.html" class="badge rounded-pill chip-roca d-inline-flex align-items-center gap-2 p-1 pe-3 text-decoration-none">
      <img src="${participante.foto}" alt="Foto de ${participante.nome}"
           class="rounded-circle object-fit-cover" width="32" height="32">
      <span>${participante.nome}</span>
    </a>`;
}

async function carregarHome() {
  try {
    const [roca, peoes] = await Promise.all([
      buscarParticipantesDaRoca(), 
      buscarDemaisPeoes()          
    ]);

    chipsRoca.innerHTML = roca.map(criarChip).join("");

 
    infoPeoes.textContent = `Outros ${peoes.length} peões estão fora da roça e seguem na fazenda.`;
  } catch (erro) {
    console.error(erro);
    alerta.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Não foi possível carregar os participantes. O JSON Server está rodando (npm start)?
      </div>`;
  }
}

carregarHome();