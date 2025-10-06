const tabuleiroDiv = document.getElementById('tabuleiro');
const statusDiv = document.getElementById('status');
const timerDiv = document.getElementById('timer');
const resetBtn = document.getElementById('reset');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

let cartas = [];
let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let paresEncontrados = 0;

let tempo = 0;
let tempoMaximo = 30;
let timerInterval = null;
let nivelAtual = 0;
const simbolosBase = ['🐻','🐼','🐨','🦊','🐶','🐱','🦄','🐷','🐵','🐸','🐝','🐞','🦋','🦁','🐔','🐙','🐢','🐧','🐬','🦉','🐿️','🦖','🦩','🐉'];

function criarJogo() {
  clearInterval(timerInterval);
  tempo = 0;

  let numPares = [8,12,16,20,24][nivelAtual] || 24;
  tempoMaximo = numPares * 4;
  timerDiv.textContent = `⏰ 0s / ${tempoMaximo}s`;

  cartas = [...simbolosBase.slice(0,numPares), ...simbolosBase.slice(0,numPares)];
  cartas.sort(() => Math.random() - 0.5);

  tabuleiroDiv.innerHTML = '';
  tabuleiroDiv.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(cartas.length))}, 100px)`;

  cartas.forEach((simbolo,index)=>{
    const carta = document.createElement('div');
    carta.classList.add('carta');
    carta.dataset.simbolo = simbolo;
    carta.dataset.index = index;
    carta.addEventListener('click', virarCarta);
    tabuleiroDiv.appendChild(carta);
  });

  primeiraCarta = null;
  segundaCarta = null;
  bloqueado = false;
  paresEncontrados = 0;
  statusDiv.textContent = `Nível ${nivelAtual+1}: Encontre todos os pares! 🐻`;

  iniciarTemporizador();
}

function iniciarTemporizador(){
  clearInterval(timerInterval);
  timerInterval = setInterval(()=>{
    tempo++;
    timerDiv.textContent = `⏰ ${tempo}s / ${tempoMaximo}s`;
    if(tempo >= tempoMaximo){
      clearInterval(timerInterval);
      bloquearTabuleiro();
      statusDiv.textContent = `⏰ Tempo esgotado! Tentativa reiniciada...`;
      setTimeout(criarJogo, 2000);
    }
  },1000);
}

function bloquearTabuleiro(){
  bloqueado = true;
  document.querySelectorAll('.carta').forEach(c=>{
    if(!c.classList.contains('matched')) c.classList.add('flipped');
  });
}

function virarCarta(e){
  if(bloqueado) return;
  const carta = e.currentTarget;
  if(carta.classList.contains('flipped') || carta.classList.contains('matched')) return;

  carta.classList.add('flipped');
  carta.textContent = carta.dataset.simbolo;

  if(!primeiraCarta) primeiraCarta = carta;
  else{
    segundaCarta = carta;
    checarPar();
  }
}

function checarPar(){
  bloqueado = true;
  if(primeiraCarta.dataset.simbolo === segundaCarta.dataset.simbolo){
    primeiraCarta.classList.add('matched');
    segundaCarta.classList.add('matched');
    paresEncontrados++;
    setTimeout(()=>{
      resetarViradas();
      if(paresEncontrados === cartas.length/2){
        nivelAtual++;
        dispararConfete();
        statusDiv.textContent = `🎉 Você passou de nível! Preparando próximo nível...`;
        setTimeout(criarJogo,1500);
      }
      else bloqueado=false;
    },500);
  }else{
    setTimeout(()=>{
      primeiraCarta.classList.remove('flipped');
      segundaCarta.classList.remove('flipped');
      primeiraCarta.textContent = '';
      segundaCarta.textContent = '';
      resetarViradas();
    },800);
  }
}

function resetarViradas(){
  primeiraCarta=null;
  segundaCarta=null;
  bloqueado=false;
}

resetBtn.addEventListener('click', ()=>{
  nivelAtual=0;
  criarJogo();
});

criarJogo();

/* ================= CONFETE ================= */
canvas