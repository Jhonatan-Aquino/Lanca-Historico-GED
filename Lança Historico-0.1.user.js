// ==UserScript==
// @name          Lança Historico
// @version       0.1
// @description   Lança Historico usando um CSV
// @author        Jhonatan Aquino
// @match         https://*.seduc.mt.gov.br/ged/hwmgedhistorico.aspx*
// @match         http://*.seduc.mt.gov.br/ged/hwmgedhistorico.aspx*
// @copyright     none
// @grant         none
// ==/UserScript==

// Carrega jQuery
(function() {
	var libJquery = document.createElement('script');
	libJquery.src = 'https://code.jquery.com/jquery-3.4.0.min.js';
	libJquery.type = 'text/javascript';
	document.head.appendChild(libJquery);
})();

// Adiciona estilos personalizados
(function() {
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = `
    .botaoSCT {
      background: #EBEBEB;
      backdrop-filter: blur(6px);
      border-radius: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: #087EFF;
      font-size: 12px;
      font-weight: normal;
      padding: 9px 20px;
      min-width: 124.5px;
      margin: 5px;
      text-decoration: none;
      transition: all 0.15s ease-in-out;
    }
    .botaoSCT:hover {
      background: #3982F7;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
      transform: scale(1.02);
      color: #fff;
    }
    #csvFileInput {
      width: 85%;
      max-width: 355px;
      height: 45px;
      padding: 10px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(8px);
      color: #676767;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }
    .btninserido {
      background: rgba(84, 210, 105, 0.71);
      color:#092808  !important;
      box-shadow: none;
    }.btninserido:hover {
      background: rgba(84, 210, 105, 1);
    }
    #loadingGif {
      width: 100px;
    }
    .divbotoes {
      max-height: 600px;
      overflow: hidden;
      line-height: 20px;
    }
    .divcarregando {
      overflow: hidden;
      display:none;
    }
    .open {
      max-height: 500px;
    }
    .closed {
      max-height: 0px;
    }.credito1 * {
    font-family: Helvetica, Arial, sans-serif !important;
}  #loadingBtn {
    position: relative;
    padding: 25px 20px;
    font-size: 14px;
    background: none;
    color: #087DFF;
    cursor: pointer;
    border-radius: 5px;
    overflow: hidden;
    border:none;
  }
svg:hover path{
fill:#087DFF !Important;
}
  #loadingBtn.loading {
    color: #087DFF;
    pointer-events: none;
  }

  #loadingBtn.loading::after {
    content: "";
    position: absolute;
    width: 56px;
    height: 56px;
    border: 3px solid #087DFF;
    border-top-color: transparent;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: spin 1.8s linear infinite;
  }

  @keyframes spin {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  .mensagem{
  display:none;
  padding: 18.5px;
  border-radius: 15px;
  background: rgba(255,255,255,0.3);
  margin-bottom: -20px;
  }

  .msgcancela{
  background: none;
  box-shadow: none;
  border-color: #ddd;
  color: #d94839;
  }

    .msgcancela:hover{
    background: #f26865;
    border:none;
  }
  .divlog{
 background: rgba(244, 244, 244, 0.58);
  border-radius: 16px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0);
  backdrop-filter: blur(6.6px);
  -webkit-backdrop-filter: blur(6.6px);
  border: 1px solid rgba(214, 214, 214, 0.27);
  color: #000;
  width: auto;
  text-align: center;
  font-weight: bold;
  position: absolute;
  z-index: 2002;
  padding: 5px;
  top: -45px;
  height: 25px;
  min-width: 340px;
  color: #087EFF;
      font-size: 14px;
      font-weight: normal;
      font-family: Helvetica, Arial, sans-serif !important;
      line-height:25px;
      display: none;
  }
  `;
	document.head.appendChild(style);
})();

// Inicializa a variável para armazenar os dados CSV
var Mxhistorico = [];


// Cria o botão para exibir ou minimizar a caixa de conteúdo
var btnExibir = document.createElement('input');
btnExibir.type = 'button';
btnExibir.id = 'exibir1';
btnExibir.value = 'MINIMIZAR';
btnExibir.className = 'menuSCT';
btnExibir.style = `
  background: #474e68;
  color: #ffffff;
  font-size: 12px;
  border:none;
  width: 100px;
  height: 30px;
  position: fixed;
  z-index: 2002;
  bottom: 1px;
  right: 30px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
  border-radius:15px;
`;
btnExibir.onmouseover = () => btnExibir.style.backgroundColor = "#3982F7";
btnExibir.onmouseout = () => btnExibir.style.backgroundColor = "#474e68";
btnExibir.onclick = function() {
	$("#credito1").slideToggle();
	this.value = this.value === "MINIMIZAR" ? "ABRIR" : "MINIMIZAR";
};
document.body.appendChild(btnExibir);

// Cria a caixa de conteúdo
var divCredit = document.createElement('div');
divCredit.id = 'credito1';
divCredit.className = 'menuSCT';
divCredit.style = `
background: rgba(214, 214, 214, 0.58);
border-radius: 16px;
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(6.6px);
-webkit-backdrop-filter: blur(6.6px);
border: 1px solid rgba(214, 214, 214, 0.27);
  border-radius: 16px;
  color: #000;
  width: auto;
  text-align: center;
  font-weight: bold;
  position: fixed;
  z-index: 2002;
  padding: 15px;
  bottom:33px;
  right: 30px;
  height: auto;
min-width:350px;
`;
document.body.appendChild(divCredit);

// Atualiza o conteúdo da divCredit
divCredit.innerHTML = `
<div class="divlog" id="divlog"></div>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" class="btnscontrole"  width="20" height="20" style="display:none; float:left;margin: -6px;" id="btnvoltar" viewBox="0 0 256 256" xml:space="preserve">

<defs>
</defs>
<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
	<path d="M 4 49 h 82 c 2.209 0 4 -1.791 4 -4 s -1.791 -4 -4 -4 H 4 c -2.209 0 -4 1.791 -4 4 S 1.791 49 4 49 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #666; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
	<path d="M 16.993 61.993 c 1.023 0 2.048 -0.391 2.828 -1.172 c 1.563 -1.562 1.563 -4.095 0 -5.656 L 9.657 45 l 10.164 -10.164 c 1.563 -1.562 1.563 -4.095 0 -5.657 c -1.561 -1.562 -4.094 -1.562 -5.656 0 L 1.172 42.171 C 0.422 42.922 0 43.939 0 45 c 0 1.061 0.422 2.078 1.172 2.828 l 12.993 12.993 C 14.945 61.603 15.97 61.993 16.993 61.993 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #666; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
</g>
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" class="btnscontrole"  width="20" height="20" style="display:none; float:right;margin: -6px;" id="btnatualizar" viewBox="0 0 256 256" xml:space="preserve">

<defs>
</defs>
<g style="stroke: none; fill:red; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
	<path d="M 7.533 47.791 c 0.07 0.027 0.142 0.045 0.214 0.067 c 0.132 0.04 0.264 0.074 0.403 0.096 c 0.036 0.006 0.07 0.021 0.106 0.025 C 8.377 47.993 8.496 48 8.615 48 c 0.2 0 0.398 -0.021 0.592 -0.06 c 0.118 -0.024 0.228 -0.066 0.341 -0.103 c 0.073 -0.024 0.148 -0.039 0.219 -0.068 c 0.128 -0.053 0.246 -0.124 0.364 -0.194 c 0.049 -0.029 0.103 -0.05 0.151 -0.082 c 0.164 -0.11 0.317 -0.235 0.457 -0.375 l 7.672 -7.672 c 1.172 -1.171 1.172 -3.071 0 -4.242 c -1.171 -1.172 -3.071 -1.172 -4.242 0 l -1.513 1.513 c 3.694 -14.43 16.807 -25.13 32.372 -25.13 c 12.993 0 24.908 7.625 30.354 19.427 c 0.693 1.504 2.477 2.16 3.98 1.467 c 1.505 -0.694 2.161 -2.477 1.467 -3.981 C 74.406 14.581 60.353 5.587 45.028 5.587 c -18.641 0 -34.29 13.013 -38.367 30.428 l -1.097 -1.803 c -0.862 -1.416 -2.707 -1.866 -4.123 -1.003 c -1.415 0.861 -1.865 2.707 -1.003 4.123 l 5.614 9.227 c 0.011 0.018 0.027 0.031 0.038 0.049 c 0.093 0.145 0.2 0.279 0.316 0.406 c 0.027 0.03 0.049 0.064 0.077 0.093 c 0.148 0.149 0.311 0.282 0.488 0.398 c 0.046 0.03 0.097 0.051 0.145 0.079 C 7.249 47.662 7.387 47.734 7.533 47.791 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill:#666; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
	<path d="M 89.562 52.668 l -5.614 -9.227 c -0.01 -0.017 -0.025 -0.03 -0.036 -0.047 c -0.095 -0.149 -0.205 -0.287 -0.324 -0.417 c -0.024 -0.027 -0.044 -0.058 -0.069 -0.084 c -0.148 -0.15 -0.312 -0.283 -0.489 -0.399 c -0.045 -0.03 -0.095 -0.05 -0.142 -0.077 c -0.135 -0.079 -0.274 -0.151 -0.421 -0.208 c -0.07 -0.027 -0.142 -0.044 -0.214 -0.066 c -0.132 -0.04 -0.264 -0.074 -0.403 -0.096 c -0.036 -0.006 -0.07 -0.021 -0.107 -0.025 c -0.052 -0.006 -0.103 0.003 -0.155 -0.001 C 81.52 42.016 81.455 42 81.386 42 c -0.061 0 -0.117 0.014 -0.177 0.018 c -0.093 0.005 -0.184 0.014 -0.276 0.028 c -0.128 0.019 -0.25 0.049 -0.372 0.084 c -0.08 0.023 -0.159 0.044 -0.236 0.073 c -0.135 0.051 -0.262 0.116 -0.387 0.185 c -0.059 0.033 -0.12 0.059 -0.177 0.096 c -0.18 0.116 -0.349 0.247 -0.5 0.398 l -7.672 7.672 c -1.172 1.171 -1.172 3.071 0 4.242 c 1.172 1.172 3.07 1.172 4.242 0 l 1.513 -1.513 c -3.694 14.43 -16.807 25.13 -32.372 25.13 c -13.459 0 -25.544 -8.011 -30.788 -20.408 c -0.646 -1.526 -2.405 -2.243 -3.932 -1.594 c -1.526 0.646 -2.24 2.405 -1.594 3.932 c 6.185 14.622 20.439 24.07 36.314 24.07 c 18.641 0 34.29 -13.013 38.367 -30.429 l 1.097 1.803 c 0.564 0.928 1.553 1.44 2.565 1.44 c 0.531 0 1.069 -0.141 1.557 -0.437 C 89.974 55.929 90.424 54.084 89.562 52.668 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill:#666; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
</g>
</svg>
  <div class="divseletor">
    <h3 style="font-size:15pt;font-family: Helvetica, Arial, sans-serif !important;">Faça upload do arquivo .CSV<br>gerado pela planilha do Excel!</h3>
    <span style='font-weight:normal;font-family: Helvetica, Arial, sans-serif !important;'>Caso não tenha a planilha base, <a target="_blank" href="https://drive.google.com/file/d/1x5FGs3agkSYgXV2klfGckxF5RboWJ-rC/view?usp=drive_link">clique aqui para fazer o download.</a></span><br><br>
    <br><br><input type='file' id='csvFileInput' accept='.csv'>
    <br><br>
    <input type='button' id='btnCarregarDados' value='Carregar dados' class='botaoSCT'>
    <br><br><br>
  </div>
  <div class='divcarregando'><p style='font-weight:bold;font-size:20pt; line-height:0px; margin-bottom:20px; font-family: Helvetica, Arial, sans-serif !important;'>AGUARDE!</p><p style='font-weight:normal;font-family: Helvetica, Arial, sans-serif !important;' >estou inserindo o seu histórico...</p><button id="loadingBtn" onclick="startLoading()">0%</button></div>
  <div class='divbotoes' style='display:none'></div><br>
  <div><span style='font-size:8pt;font-weight:normal;font-family: Helvetica, Arial, sans-serif !important;'>< Jhonatan Aquino /></span></div>
  <div><span style='font-size:8pt;font-weight:normal;font-family: Helvetica, Arial, sans-serif !important;'>${GM_info.script.name} v${GM_info.script.version}</span></div>
`;

// Cria o iframe
var ifrIframe1 = document.createElement("iframe");
ifrIframe1.setAttribute("id", "iframe1");
ifrIframe1.setAttribute("src", "about:blank");
ifrIframe1.setAttribute("style", "height: 700px; width: 1000px; display:none; bottom:30px; left:30px");
divCredit.appendChild(ifrIframe1);

var ifrIframe2 = document.createElement("iframe");
ifrIframe2.setAttribute("id", "iframe2");
ifrIframe2.setAttribute("src", "about:blank");
ifrIframe2.setAttribute("style", "height: 700px; width: 1000px; display:none; bottom:30px; left:30px");
divCredit.appendChild(ifrIframe2);

// Adiciona o evento para carregar o CSV
document.getElementById('btnCarregarDados').addEventListener('click', lerCSV);
document.getElementById('btnatualizar').addEventListener('click', lerCSV);
document.getElementById('btnvoltar').addEventListener('click', voltar);
function voltar() {
    // Oculta os botões e controles e exibe o seletor novamente
    setTimeout(() => {$('.divbotoes').slideUp(500, 'swing');}, 100);
    $('.btnscontrole').fadeOut(500);
    $('.divseletor').slideDown(500, 'swing');
}

// Função para ler o arquivo CSV selecionado
function lerCSV() {
    var input = document.getElementById('csvFileInput');
    var file = input.files[0];
    if (!file) {
        alert("Selecione um arquivo CSV primeiro!");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(event) {
        var csvData = event.target.result;
        processarCSV(csvData);
    };
    reader.readAsText(file);
}

// Processa os dados do CSV e organiza em matriz
function processarCSV(csvData) {
    var linhas = csvData.split("\n").map(linha => linha.split(","));
    Mxhistorico = []; // Limpa a matriz antes de preencher

    // Organiza os dados do CSV em colunas de 4 elementos
    for (let col = 0; col < linhas[0].length - 1; col += 4) {
        let colunaMx = linhas.map(linha => [linha[col], linha[col + 1], linha[col + 2], linha[col + 3]]);
        Mxhistorico.push(colunaMx);
    }

    criarBotoesHistorico();
    verificanomeano();
}

// Verifica os anos disponíveis no histórico do aluno
async function verificanomeano() {
    var coluna = Mxhistorico[0];
    var codaluno = coluna[1][0];

    document.querySelector('#vGEDALUCOD').value = codaluno;
    document.querySelector('.btnConsultar').click();

    ifrIframe2.src = "http://sigeduca.seduc.mt.gov.br/ged/hwmgedhistorico.aspx?" + codaluno;
    ifrIframe2.addEventListener("load", async function() {
        await esperar(1000);

        let vetor = [];
        let i = 1;

        // Obtém os anos disponíveis no histórico do aluno
        while (true) {
            let span = document.getElementById('span_vDESC_GEDHISTANO_000' + String(i));
            if (span === null) break;
            vetor.push([span.innerHTML, i]);
            i++;
        }

        // Marca os botões correspondentes aos anos já inseridos
        vetor.forEach(function(item) {
            let ano = item[0];
            let iValue = item[1];

            let inputs = document.querySelectorAll('input[data-ano="' + ano + '"]');
            inputs.forEach(function(input) {
                input.classList.add('btninserido');
                input.setAttribute('data-index', iValue);
            });
        });

        // Exibe o nome do aluno na interface
        const nomealuno = document.getElementById("span_vGEDALUNOM").innerHTML;
        document.querySelector('.divbotoes>p').innerHTML = "Selecione o ano que deseja inserir para <br><b>" + nomealuno + "</b>.";
    });
}

// Cria os botões correspondentes aos anos disponíveis no CSV
async function criarBotoesHistorico() {
    var divBotoes = document.querySelector('.divbotoes');
    divBotoes.innerHTML = '<p style="font-family: Helvetica, Arial, sans-serif !important; font-weight:normal;">Selecione o ano que deseja inserir</p>';

    Mxhistorico.forEach((coluna, index) => {
        var ano = coluna[0][0];
        var botao = document.createElement('input');
        botao.setAttribute('type', 'button');
        botao.setAttribute('class', 'botaoSCT');
        botao.setAttribute('value', 'Inserir histórico de ' + ano);
        botao.setAttribute('data-index', index);
        botao.setAttribute('data-ano', ano);
        botao.addEventListener("click", function() { inserir(this, index); });
        divBotoes.appendChild(botao);
        divBotoes.appendChild(document.createElement('br'));
    });

    await esperar(500);
    $('.divseletor').slideUp(500);
    setTimeout(() => { $('.divbotoes').slideDown(500, 'swing'); }, 100);
    $('.btnscontrole').fadeIn(500);
}
// Função para inserir os dados no histórico
async function inserir(bot, index) {
    deletarmsg();
    await esperar(500);

    var anobotao = bot.getAttribute('data-ano');
    var indexbotao = bot.getAttribute('data-index');
    var classebotao = bot.getAttribute('class');

    if (classebotao.includes('btninserido')) {
        var codhistorico = document.getElementById('span_vGRIDGEDHISTCOD_000' + String(indexbotao)).innerHTML.replace(/\s+/g, '');

        let novoNo = document.createElement('div');
        novoNo.setAttribute('class', 'mensagem');
        novoNo.innerHTML = `
            <p style="font-family: Helvetica, Arial, sans-serif !important; font-weight:normal;">
                Tem certeza que deseja sobrescrever o histórico de ${anobotao}?
            </p>
            <input type="button" class="botaoSCT msgsim" value="SOBRESCREVER">
            <input type="button" class="botaoSCT msgcancela" value="Cancelar">
        `;

        bot.insertAdjacentElement('afterend', novoNo);
        $('.mensagem').slideToggle();

        document.querySelector(".msgcancela").addEventListener("click", deletarmsg);
        document.querySelector(".msgsim").addEventListener("click", function() {
            preencherFormulario(codhistorico, index);
        });
    } else {
        preencherFormulario(1, index);
    }
}

// Função para exibir a matriz de dados
function exibirMatriz(matriz) {
    var outputDiv = document.querySelector('.divbotoes');
    let html = "<h3>Matriz Gerada:</h3>";

    html += matriz.map((coluna, index) => {
        let colText = `Coluna ${index + 1}:<br>`;
        colText += coluna.map(linha => Array.isArray(linha) ? `[${linha.join(" | ")}]` : linha).join(" | ");
        return `<p>${colText}</p>`;
    }).join("");

    outputDiv.innerHTML = html;
    console.log("Matriz gerada:", matriz);
}

// Função para arredondar para cima se a parte decimal for maior que 0.7
function arredondarParaCimaSeMaiorQueMeia(numero) {
    return numero % 1 > 0.7 ? Math.ceil(numero) : Math.floor(numero);
}

// Função para atualizar a barra de progresso
function atualizarProgresso(quantia) {
    let div = document.getElementById("loadingBtn");
    let progressoAtual = div.innerText.trim() ? parseInt(div.innerText) : 0;
    let novoProgresso = Math.min(progressoAtual + quantia, 100);
    div.innerText = arredondarParaCimaSeMaiorQueMeia(novoProgresso) + "%";
}

// Função auxiliar para aguardar um tempo específico
function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para esperar o carregamento de um iframe e verificar se um select tem opções
function esperarCarregarIframe(iframe, seletorSelect) {
    return new Promise((resolve) => {
        let checkOpcoesExist = async () => {
            let select = iframe.contentDocument.querySelector(seletorSelect);
            if (select && select.options.length > 1) {
                resolve();
            } else {
                await esperar(3000);
                checkOpcoesExist();
            }
        };
        checkOpcoesExist();
    });
}
// Função para deletar a mensagem de confirmação
async function deletarmsg() {
    let mensagem = document.querySelector('.mensagem');
    if (mensagem) {
        $('.mensagem').slideToggle();
        await esperar(500);
        mensagem.remove();
    }
}
function exibirLog(texto, tempo, cor = "#087EFF") {
    let divLog = document.getElementById("divlog");
    divLog.innerText = texto;
    divLog.style.color = cor; // Define a cor do texto
    $('.divlog').fadeIn(300);
    setTimeout(() => {$('.divlog').fadeOut(300);}, tempo);
}

// Função para preencher o formulário de histórico escolar
async function preencherFormulario(codhistorico, index) {
    exibirLog('Iniciando!', 3000,'#f26865');
    $('.btnscontrole').fadeOut(500);
    setTimeout(() => {
        $('.divbotoes').slideUp(500, 'swing');
    }, 100);
    $('.divcarregando').slideDown(600, 'swing');

    let btn = document.getElementById("loadingBtn");
    btn.classList.add("loading");

    if (!Mxhistorico || !Mxhistorico[index]) {
        console.error("Índice inválido ou matriz não definida.");
        return;
    }

    atualizarProgresso(5);
    divCredit.appendChild(ifrIframe1);
    let coluna = Mxhistorico[index].filter(linha =>
        linha.some(valor => valor !== null && valor !== undefined && valor !== "")
    );

    let codaluno = coluna[1][0];
    let tipodeavaliacao = coluna[2][2] === "" || /\d/.test(coluna[2][2]) ? "NOTA" : "CONCEITO";

    ifrIframe1.src = codhistorico == 1
        ? `http://sigeduca.seduc.mt.gov.br/ged/HWGedValidacaoHistorico.aspx?${codhistorico},${codaluno},,0,HWMGedHistorico`
        : `http://sigeduca.seduc.mt.gov.br/ged/hwtgedhistoricoescolar.aspx?${codhistorico},${codaluno},HWMGedHistorico,13072,UPD,N`;

    atualizarProgresso(5);

    ifrIframe1.addEventListener("load", async function () {
        let iframe = parent.document.querySelector("iframe#iframe1");
        let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        iframeDoc.getElementById("vGEDHISTANO").value = coluna[0][0] || "";
        iframeDoc.getElementById("vGEDSERIECOD").value = coluna[0][1] || "";
        iframeDoc.getElementById("vGEDHISTCRGHOR").value = "";
        iframeDoc.getElementById("vGEDHISTNOMLOT").setAttribute("value", coluna[0][2] || "");
        iframeDoc.getElementById("vGEDHISTCIDID").setAttribute("value", coluna[0][3] || "");

        const changeEvent = new Event('change');

        let selectAvaliacao = iframeDoc.getElementById('vGEDHISTFRMAVA');
        selectAvaliacao.value = tipodeavaliacao === "NOTA" ? "3" : "2";
        selectAvaliacao.dispatchEvent(changeEvent);

        await esperar(900);
        await esperarCarregarIframe(ifrIframe1, "#vGEDHISTTPO");

        let selectTipo = iframeDoc.getElementById('vGEDHISTTPO');
        selectTipo.value = "D";
        selectTipo.dispatchEvent(changeEvent);

        let tamanhocoluna = coluna.length;
        atualizarProgresso(5);
        let evolucao = 85 / (tamanhocoluna - 2);

        for (let linha = 2; linha < tamanhocoluna; linha++) {
            await esperar(1000);
            await esperarCarregarIframe(ifrIframe1, "#vGEDHISTAREACOD");

            let selectArea = iframeDoc.getElementById('vGEDHISTAREACOD');
            selectArea.value = coluna[linha][0] || "";
            selectArea.dispatchEvent(changeEvent);
            atualizarProgresso(evolucao / 5);

            await esperar(500);
            await esperarCarregarIframe(ifrIframe1, "#vGEDHISTDISCCOD");

            let selectDisciplina = iframeDoc.getElementById('vGEDHISTDISCCOD');
            selectDisciplina.value = coluna[linha][1] || "";
            selectDisciplina.dispatchEvent(changeEvent);
            atualizarProgresso(evolucao / 5);

            var nomedadisciplina = selectDisciplina.querySelector('option[value="'+coluna[linha][1]+'"]').textContent;
            await esperar(300);

           let elemento = tipodeavaliacao === "NOTA"
            ? iframeDoc.getElementById("vGEDHISTDISCAVANOTA")
            : iframeDoc.getElementById("vGEDHISTDISCCONSGL");
            elemento.value = tipodeavaliacao === "NOTA"
            ? (coluna[linha][2] || "").replace(/\./g, ",")
            : coluna[linha][2];
            elemento.dispatchEvent(changeEvent);

            atualizarProgresso(evolucao / 5);

            await esperar(500);
            iframeDoc.getElementById("vGEDHISTDISCCRGHOR").value = coluna[linha][3];
            iframeDoc.getElementById("vGEDHISTDISCCRGHOR").dispatchEvent(changeEvent);
            atualizarProgresso(evolucao / 5);

            await esperar(1000);
            iframeDoc.querySelector(".btnIncluir")?.click();
            atualizarProgresso(evolucao / 5);

            //Exibir log da displina incluida
            exibirLog(nomedadisciplina + '  Inserido!', 1500);

        }


        await esperar(4000);

        $('.divcarregando').slideUp(1000);
        btn.classList.remove("loading");
        exibirLog('CONCLUÍDO!', 4000,'#7ED88D');
        lerCSV();
        await esperar(3000);

        document.getElementById("loadingBtn").innerText = "0%";
        let botaoIndex = document.querySelector(`.botaoSCT[data-index="${index}"]`);
        ifrIframe1.src = "blank";
        iframe.remove();
    });
}
