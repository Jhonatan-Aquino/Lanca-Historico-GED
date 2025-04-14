// ==UserScript==
// @name          Lança Historico
// @namespace     http://tampermonkey.net/
// @version       3.3
// @description   Lança Historico escolar com base do preenchimento de uma tabela do (Excel/Google Sheets)
// @author        Jhonatan Aquino
// @match         https://*.sigeduca.seduc.mt.gov.br/ged/hwmgedhistorico.aspx*
// @match         http://*.sigeduca.seduc.mt.gov.br/ged/hwmgedhistorico.aspx*
// @grant         GM_xmlhttpRequest
// @updateURL     https://raw.githubusercontent.com/Jhonatan-Aquino/Lanca-Historico-GED/main/Lancamento-Automatico_Historico.user.js
// @downloadURL   https://raw.githubusercontent.com/Jhonatan-Aquino/Lanca-Historico-GED/main/Lancamento-Automatico_Historico.user.js
// @require       https://code.jquery.com/jquery-3.6.0.min.js
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
        /* Estilos base e reset */

        #containerLAH{
            background: rgba(220, 220, 220, 0.58);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(6.6px);
            -webkit-backdrop-filter: blur(6.6px);
            border: 1px solid rgba(214, 214, 214, 0.27);
            border-radius: 20px;
            color: #474e68;
            width: auto;
            text-align: center;
            font-weight: bold;
            position: fixed;
            z-index: 2002;
            padding: 15px;
            bottom: 33px;
            right: 30px;
            height: auto;
            min-width: 350px;
        }
        #containerLAH * {
            font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important;
        }


        #containerLAH a {
            color: #666 !important;
        }
 #containerLAH .divseletor {
            padding: 0;
            text-align: center;
            min-width: 460px;
        }

           /* Estilos do botão de exibir */
        #exibirLAH {
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            font-weight: 500;
            letter-spacing: 0.3px;
            padding: 5px 15px;
        }
        /* Estilo base do botão LAH */
            #containerLAH .botaoSCT {
                background: #ebebeb;
                backdrop-filter: blur(6px);
                border-radius: 20px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.25);
                color: #087eff;
                font-size: 13px;
                font-weight: normal;
                padding: 9px 20px;
                min-width: 124.5px;
                margin: 5px;
                text-decoration: none;
                transition: all 0.15s ease-in-out;
            }

             #containerLAH .msgsim, #containerLAH  #btnCarregarDados {
            background: #3982f7;
            color: #fff;
            border: none;
        }

        #containerLAH .msgsim:hover, #containerLAH  #btnCarregarDados:hover{
            background: #3982f7;
            opacity: 0.9;
            transform: scale(1.02);
        }


            /* Hover padrão */
            #containerLAH .botaoSCT:hover {
                background: #3982f7;
                transform: scale(1.02);
                color: #fff;
            }

            /* Botão de sucesso */
            #containerLAH .btninserido {
                background: #34A568;  /* Aumentei opacidade para mais consistência */
                color: #fff !important;  /* Mudei para branco para maior consistência */
                border: none;
            }

            #containerLAH .btninserido:hover {
                background: rgba(84, 210, 105, 1);
                transform: scale(1.02);
            }

        /* Estilos da área de texto */
        #containerLAH #TEXTAREACSV {
            width: 450px;
            height: 150px;
            padding: 10px;
            border: 1px solid rgba(255, 255, 255, 0.7);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(8px);
            color: #666;
            transition: all 0.2s ease-in-out;
            resize: none;
            font-size: 10pt;
        }

        /* Estilos das divisões */
        #containerLAH .divseletor h3 {
            font-size: 28px !important;
            font-weight: 500 !important;
            margin-bottom: 15px;
            color: #1d1d1f;
            letter-spacing: -0.5px;
        }

        #containerLAH .divbotoes {
            max-height: 600px;
            overflow: hidden;
            line-height: 20px;
        }

        #containerLAH .divajuda {
            display: none;
            max-width: 460px;
            max-height: 700px;
            overflow: hidden;
            line-height: 20px;
            font-size: 11px;
            font-weight: normal;
            text-align: justify;
        }

        #containerLAH .divcarregando {
            overflow: hidden;
            display: none;
        }

        #containerLAH .divlog {
            background: rgba(244, 244, 244, 0.58);
            border-radius: 16px;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0);
            backdrop-filter: blur(6.6px);
            -webkit-backdrop-filter: blur(6.6px);
            border: 1px solid rgba(214, 214, 214, 0.27);
            color: #087eff;
            width: auto;
            text-align: center;
            position: absolute;
            z-index: 2002;
            padding: 5px;
            top: -45px;
            height: 25px;
            min-width: 340px;
            font-size: 14px;
            font-weight: normal;
            line-height: 25px;
            display: none;
        }

        /* Estados de altura */
        #containerLAH .open {
            max-height: 500px;
        }

        #containerLAH .closed {
            max-height: 0px;
        }

        /* Estilos de loading */
        #containerLAH #loadingGif {
            width: 100px;
        }

        #containerLAH #loadingBtn {
            position: relative;
            padding: 25px 20px;
            font-size: 14px;
            background: none;
            color: #087dff;
            cursor: pointer;
            border-radius: 5px;
            overflow: hidden;
            border: none;
        }

        #containerLAH #loadingBtn.loading {
            color: #087dff;
            pointer-events: none;
        }

        #containerLAH #loadingBtn.loading::after {
            content: "";
            position: absolute;
            width: 56px;
            height: 56px;
            border: 3px solid #087dff;
            border-top-color: transparent;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: spin 1.8s linear infinite;
        }

        /* Estilos SVG */
        #containerLAH svg:hover path {
            fill: #087dff !important;
        }

        /* Estilos de mensagem */
        #containerLAH .mensagem {
            display: none;
            padding: 18.5px;
            border-radius: 15px;
            background: rgba(255, 255, 255, 0.3);
            margin-bottom: -20px;
        }

        #containerLAH .msgcancela {
            background: none;
            box-shadow: none;
            border-color: #ddd;
            color: #d94839;
        }

        #containerLAH .msgcancela:hover {
            background: #f26865;
        }

        /* Animações */
        @keyframes spin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
  `;
	document.head.appendChild(style);
})();

// Inicializa a variável para armazenar os dados CSV
var Mxhistorico = [];

// Adiciona no início do script, após as declarações de variáveis globais
var permissoesHistorico = new Map();

// Adiciona funções para manipular cookies (MOVER PARA ANTES DA CRIAÇÃO DO BOTÃO)
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Verifica o estado do cookie ao carregar a página
$(document).ready(function() {
    let containerState = getCookie('containerLAHState');
    if(containerState !== null) {
        containerState = containerState === 'true';
        if(!containerState) {
            $("#containerLAH").hide();
            btnExibir.value = "ABRIR | Lançador de históricos";
        }
    }
});

// Cria o botão para exibir ou minimizar a caixa de conteúdo
var btnExibir = document.createElement('input');
btnExibir.type = 'button';
btnExibir.id = 'exibirLAH';
btnExibir.value = 'MINIMIZAR';
btnExibir.className = 'menuSCT';
btnExibir.style = `
  background: #474e68;
  color: #ffffff;
  font-size: 12px;
  border:none;
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

// Configura o evento de clique com as funções de cookie
btnExibir.onclick = function() {
    $("#containerLAH").slideToggle();
    this.value = this.value === "MINIMIZAR" ? "ABRIR | Lançador de históricos" : "MINIMIZAR";
    setCookie('containerLAHState', this.value === "MINIMIZAR", 30);
};

document.body.appendChild(btnExibir);

// Cria a caixa de conteúdo
var divCredit = document.createElement('div');
divCredit.id = 'containerLAH';
divCredit.className = 'menuSCT';

document.body.appendChild(divCredit);

// Atualiza o conteúdo da divCredit
divCredit.innerHTML = `
<div class="divlog" id="divlog"></div>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" title="Voltar" version="1.1" class="btnscontrole"  width="20" height="20" style=" margin: 10px;position: absolute;left: 0; top: 0; display:none" id="btnvoltar" viewBox="0 0 256 256" xml:space="preserve">

<defs>
</defs>
<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
	<path d="M 4 49 h 82 c 2.209 0 4 -1.791 4 -4 s -1.791 -4 -4 -4 H 4 c -2.209 0 -4 1.791 -4 4 S 1.791 49 4 49 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #666; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
	<path d="M 16.993 61.993 c 1.023 0 2.048 -0.391 2.828 -1.172 c 1.563 -1.562 1.563 -4.095 0 -5.656 L 9.657 45 l 10.164 -10.164 c 1.563 -1.562 1.563 -4.095 0 -5.657 c -1.561 -1.562 -4.094 -1.562 -5.656 0 L 1.172 42.171 C 0.422 42.922 0 43.939 0 45 c 0 1.061 0.422 2.078 1.172 2.828 l 12.993 12.993 C 14.945 61.603 15.97 61.993 16.993 61.993 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #666; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
</g>
</svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"  title="Atualizar" class="btnscontrole"  width="20" height="20" style=" margin: 10px;position: absolute;right: 0; top: 0; display:none" id="btnatualizar" viewBox="0 0 256 256" xml:space="preserve">

<defs>
</defs>
<g style="stroke: none; fill:red; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
	<path d="M 7.533 47.791 c 0.07 0.027 0.142 0.045 0.214 0.067 c 0.132 0.04 0.264 0.074 0.403 0.096 c 0.036 0.006 0.07 0.021 0.106 0.025 C 8.377 47.993 8.496 48 8.615 48 c 0.2 0 0.398 -0.021 0.592 -0.06 c 0.118 -0.024 0.228 -0.066 0.341 -0.103 c 0.073 -0.024 0.148 -0.039 0.219 -0.068 c 0.128 -0.053 0.246 -0.124 0.364 -0.194 c 0.049 -0.029 0.103 -0.05 0.151 -0.082 c 0.164 -0.11 0.317 -0.235 0.457 -0.375 l 7.672 -7.672 c 1.172 -1.171 1.172 -3.071 0 -4.242 c -1.171 -1.172 -3.071 -1.172 -4.242 0 l -1.513 1.513 c 3.694 -14.43 16.807 -25.13 32.372 -25.13 c 12.993 0 24.908 7.625 30.354 19.427 c 0.693 1.504 2.477 2.16 3.98 1.467 c 1.505 -0.694 2.161 -2.477 1.467 -3.981 C 74.406 14.581 60.353 5.587 45.028 5.587 c -18.641 0 -34.29 13.013 -38.367 30.428 l -1.097 -1.803 c -0.862 -1.416 -2.707 -1.866 -4.123 -1.003 c -1.415 0.861 -1.865 2.707 -1.003 4.123 l 5.614 9.227 c 0.011 0.018 0.027 0.031 0.038 0.049 c 0.093 0.145 0.2 0.279 0.316 0.406 c 0.027 0.03 0.049 0.064 0.077 0.093 c 0.148 0.149 0.311 0.282 0.488 0.398 c 0.046 0.03 0.097 0.051 0.145 0.079 C 7.249 47.662 7.387 47.734 7.533 47.791 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill:#666; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
	<path d="M 89.562 52.668 l -5.614 -9.227 c -0.01 -0.017 -0.025 -0.03 -0.036 -0.047 c -0.095 -0.149 -0.205 -0.287 -0.324 -0.417 c -0.024 -0.027 -0.044 -0.058 -0.069 -0.084 c -0.148 -0.15 -0.312 -0.283 -0.489 -0.399 c -0.045 -0.03 -0.095 -0.05 -0.142 -0.077 c -0.135 -0.079 -0.274 -0.151 -0.421 -0.208 c -0.07 -0.027 -0.142 -0.044 -0.214 -0.066 c -0.132 -0.04 -0.264 -0.074 -0.403 -0.096 c -0.036 -0.006 -0.07 -0.021 -0.107 -0.025 c -0.052 -0.006 -0.103 0.003 -0.155 -0.001 C 81.52 42.016 81.455 42 81.386 42 c -0.061 0 -0.117 0.014 -0.177 0.018 c -0.093 0.005 -0.184 0.014 -0.276 0.028 c -0.128 0.019 -0.25 0.049 -0.372 0.084 c -0.08 0.023 -0.159 0.044 -0.236 0.073 c -0.135 0.051 -0.262 0.116 -0.387 0.185 c -0.059 0.033 -0.12 0.059 -0.177 0.096 c -0.18 0.116 -0.349 0.247 -0.5 0.398 l -7.672 7.672 c -1.172 1.171 -1.172 3.071 0 4.242 c 1.172 1.172 3.07 1.172 4.242 0 l 1.513 -1.513 c -3.694 14.43 -16.807 25.13 -32.372 25.13 c -13.459 0 -25.544 -8.011 -30.788 -20.408 c -0.646 -1.526 -2.405 -2.243 -3.932 -1.594 c -1.526 0.646 -2.24 2.405 -1.594 3.932 c 6.185 14.622 20.439 24.07 36.314 24.07 c 18.641 0 34.29 -13.013 38.367 -30.429 l 1.097 1.803 c 0.564 0.928 1.553 1.44 2.565 1.44 c 0.531 0 1.069 -0.141 1.557 -0.437 C 89.974 55.929 90.424 54.084 89.562 52.668 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill:#666; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
</g>
</svg>
  <div class="divseletor">
    <h3>Cole abaixo os dados do histórico<br>gerados pela planilha do Drive!</h3>
    <span style='font-weight:normal;font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important;'>Caso não tenha a planilha base, <a target="_blank" href="https://docs.google.com/spreadsheets/d/1oZ_UxN_q1TAKS2OpZewZwREdslyWKm6FrrGl4UWmjQ8/edit?usp=sharing">clique aqui para acessar o modelo.</a></span><br><br>
    <br>
    <textarea id="TEXTAREACSV" rows="10" cols="50" placeholder="Cole aqui os dados gerados na planilha..."></textarea>
    <br><br>
    <input type='button' id='btnCarregarDados' value='Carregar dados' class='botaoSCT'>
    <br><br><br>
  </div>
  <div class='divcarregando'><p style='font-weight:bold;font-size:20pt; line-height:0px; margin-bottom:20px; font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important;'>AGUARDE!</p><p style='font-weight:normal;font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important;' >estou inserindo o seu histórico...</p><button id="loadingBtn" onclick="startLoading()">0%</button></div>
  <div class='divbotoes' style='display:none'></div><br>
  <div class="divajuda"><h3 style="font-size:15pt;text-align:center; line-height: 10px;font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important;">Como usar?</h3>
  	<p><b>1. Acessar a planilha modelo:</b> O primeiro passo é acessar a planilha modelo fornecida pelo <a target="_blank" href="https://docs.google.com/spreadsheets/d/1oZ_UxN_q1TAKS2OpZewZwREdslyWKm6FrrGl4UWmjQ8/edit?usp=sharing">link</a> e fazer uma cópia dela para o seu Drive, para que você possa edita-la. Nela, você irá preencher os dados do histórico escolar.</p> <p><b>2. Preencher a planilha:</b> Complete as células indicadas com as informações necessárias. Após finalizar o preenchimento, a planilha gerará automaticamente os dados formatados em uma célula destacada.</p> <p><b>3. Copiar os dados gerados:</b> Selecione e copie todo o conteúdo da célula destacada, garantindo que todos os dados estejam incluídos.</p> <p><b>4. Colar os dados no painel de inserção:</b> No sistema de lançamento de histórico, cole os dados copiados no campo indicado e clique no botão "Carregar dados".</p> <p><b>5. Selecionar e inserir o histórico:</b> Após carregar os dados, escolha o ano correspondente e clique no botão para inserir o histórico no sistema.<br>Obs.: Quando o botão do histórico de algum ano ficar verde, significa que ele já foi inserido, mas você ainda pode lançá-lo novamente, sobrescrevendo o histórico anterior.</p>
<br><p>Pronto! Agora você pode gerenciar e atualizar os históricos escolares de forma simples e rápida.</p><br></div>
  <div><span style='font-size:8pt;font-weight:normal;font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important;'><a href="https://github.com/Jhonatan-Aquino/" target="_blank" style="text-color:rgb(71, 78, 104) !important;  text-decoration: none !important;">< Jhonatan Aquino /></a></span>
</div>
  <div><span style='font-size:8pt;font-weight:normal;font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important;'>${GM_info.script.name} v${GM_info.script.version}</span></div>
  <svg xmlns="http://www.w3.org/2000/svg" title="Ajuda" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="20" height="20" class="btnajuda" id="btnajuda" viewBox="0 0 256 256" style=" margin: 10px;position: absolute;left: 0; bottom: 0;" xml:space="preserve"><defs></defs>
<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
	<path d="M 45 58.88 c -2.209 0 -4 -1.791 -4 -4 v -4.543 c 0 -1.101 0.454 -2.153 1.254 -2.908 l 8.083 -7.631 c 1.313 -1.377 2.035 -3.181 2.035 -5.087 v -0.302 c 0 -2.005 -0.791 -3.881 -2.228 -5.281 c -1.436 -1.399 -3.321 -2.14 -5.342 -2.089 c -3.957 0.102 -7.175 3.523 -7.175 7.626 c 0 2.209 -1.791 4 -4 4 s -4 -1.791 -4 -4 c 0 -8.402 6.715 -15.411 14.969 -15.623 c 4.183 -0.109 8.138 1.439 11.131 4.357 c 2.995 2.918 4.645 6.829 4.645 11.01 v 0.302 c 0 4.027 -1.546 7.834 -4.354 10.72 c -0.04 0.041 -0.08 0.081 -0.121 0.12 L 49 52.062 v 2.818 C 49 57.089 47.209 58.88 45 58.88 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #a5a5a5; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
	<path d="M 45 71.96 c -1.32 0 -2.61 -0.53 -3.54 -1.46 c -0.23 -0.23 -0.43 -0.49 -0.62 -0.76 c -0.18 -0.271 -0.33 -0.561 -0.46 -0.86 c -0.12 -0.311 -0.22 -0.62 -0.28 -0.94 c -0.07 -0.32 -0.1 -0.65 -0.1 -0.98 c 0 -0.32 0.03 -0.65 0.1 -0.97 c 0.06 -0.32 0.16 -0.641 0.28 -0.94 c 0.13 -0.3 0.28 -0.59 0.46 -0.86 c 0.19 -0.279 0.39 -0.529 0.62 -0.76 c 1.16 -1.16 2.89 -1.7 4.52 -1.37 c 0.32 0.07 0.629 0.16 0.93 0.29 c 0.3 0.12 0.59 0.28 0.859 0.46 c 0.28 0.181 0.53 0.391 0.761 0.62 c 0.239 0.23 0.439 0.48 0.63 0.76 c 0.18 0.271 0.33 0.561 0.46 0.86 c 0.12 0.3 0.22 0.62 0.279 0.94 C 49.97 66.31 50 66.64 50 66.96 c 0 0.33 -0.03 0.66 -0.101 0.979 c -0.06 0.32 -0.159 0.63 -0.279 0.94 c -0.13 0.3 -0.28 0.59 -0.46 0.86 c -0.19 0.27 -0.391 0.529 -0.63 0.76 c -0.23 0.229 -0.48 0.439 -0.761 0.62 c -0.27 0.18 -0.56 0.34 -0.859 0.46 c -0.301 0.13 -0.61 0.22 -0.93 0.279 C 45.65 71.93 45.33 71.96 45 71.96 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #a5a5a5; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
	<path d="M 45 90 C 20.187 90 0 69.813 0 45 S 20.187 0 45 0 s 45 20.187 45 45 S 69.813 90 45 90 z M 45 8 C 24.598 8 8 24.598 8 45 s 16.598 37 37 37 s 37 -16.598 37 -37 S 65.402 8 45 8 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #bebebe; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
</g>
</svg>
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
document.getElementById('btnCarregarDados').addEventListener('click', processarTextoCSV);
document.getElementById('btnatualizar').addEventListener('click', processarTextoCSV);
document.getElementById('btnvoltar').addEventListener('click', voltar);
document.getElementById('btnajuda').addEventListener('click', ajuda);

document.getElementById('vGEDALUCOD').addEventListener('focus', function(){$('.credito').slideUp(500, 'swing');});

function voltar() {
    // Oculta os botões e controles e exibe o seletor novamente
    setTimeout(() => {$('.divbotoes').slideUp(500, 'swing');}, 100);
    $('.btnscontrole').fadeOut(500);
    $('.divseletor').slideDown(500, 'swing');
    $('.divcarregando').slideUp(500, 'swing');
    $('.divajuda').slideUp(500, 'swing');
    $('#btnajuda').fadeIn(500);
}
function ajuda() {
    // Oculta os botões e controles e exibe o seletor novamente
    setTimeout(() => {$('.divbotoes').slideUp(500, 'swing');}, 100);
    $('.divajuda').slideDown(500, 'swing');
    $('.btnajuda').fadeOut(500);
    $('#btnatualizar').fadeOut(500);
    $('.divseletor').slideUp(500, 'swing');
    $('.divcarregando').slideUp(500, 'swing');
    $('#btnvoltar').slideDown(500, 'swing');
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

// Função para processar os dados colados na textarea
function processarTextoCSV() {
    var texto = document.getElementById("TEXTAREACSV").value.trim(); // Remove espaços extras no início e fim

    // Remove aspas no início e no fim, se existirem
    if (texto.startsWith('"') && texto.endsWith('"')) {
        texto = texto.slice(1, -1);
    }

    // Divide o texto em linhas e remove as vazias
    var linhas = texto.split("\n").map(linha => linha.trim()).filter(linha => linha !== "");

    Mxhistorico = []; // Limpa a matriz antes de preencher

    // Organiza os dados do CSV em colunas de 4 elementos
    for (let col = 0; col < linhas[0].split(",").length - 1; col += 4) {
        let colunaMx = linhas.map(linha => {
            let valores = linha.split(",");
            return [
                valores[col] || "",
                valores[col + 1] || "",
                valores[col + 2] || "",
                valores[col + 3] || ""
            ];
        });
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
            
            // Verifica a permissão de alteração
            let imgPermissao = document.getElementById('vALTERAR_000' + String(i));
            let temPermissao = imgPermissao && !imgPermissao.src.includes('naoalterar.gif') ? 1 : 0;
            
            // Armazena a permissão no Map usando o código do histórico como chave
            let codHistorico = document.getElementById('span_vGRIDGEDHISTCOD_000' + String(i))?.innerHTML.replace(/\s+/g, '');
            if (codHistorico) {
                permissoesHistorico.set(codHistorico, temPermissao);
            }
            
            vetor.push([span.innerHTML, i, temPermissao]);
            i++;
        }

        // Marca os botões correspondentes aos anos já inseridos
        vetor.forEach(function(item) {
            let ano = item[0];
            let iValue = item[1];
            let permissao = item[2];

            let inputs = document.querySelectorAll('input[data-ano="' + ano + '"]');
            inputs.forEach(function(input) {
                input.classList.add('btninserido');
                input.setAttribute('data-index', iValue);
                input.setAttribute('data-perm', permissao);
                
                if (permissao === 0) {
                    input.title = 'Você não tem permissão para alterar este histórico';
                }
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
    divBotoes.innerHTML = '<p style="font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important; font-weight:normal;">Selecione o ano que deseja inserir</p>';

    Mxhistorico.forEach((coluna, index) => {
        var ano = coluna[0][0];
        var botao = document.createElement('input');
        botao.setAttribute('type', 'button');
        botao.setAttribute('class', 'botaoSCT');
        botao.setAttribute('value', 'Inserir histórico de ' + ano);
        botao.setAttribute('data-index', index);
        botao.setAttribute('data-ano', ano);
        botao.addEventListener("click", function() { 
            let permissao = this.getAttribute('data-perm');
            inserir(this, index, permissao ? parseInt(permissao) : undefined); 
        });
        divBotoes.appendChild(botao);
        divBotoes.appendChild(document.createElement('br'));
    });

    await esperar(500);
    $('.divseletor').slideUp(500);
    setTimeout(() => { $('.divbotoes').slideDown(500, 'swing'); }, 100);
    $('.btnscontrole').fadeIn(500);
    $('.btnajuda').fadeIn(500);
}
// Função para inserir os dados no histórico
async function inserir(bot, index, permissao) {
    deletarmsg();
    await esperar(500);

    var anobotao = bot.getAttribute('data-ano');
    var indexbotao = bot.getAttribute('data-index');
    var classebotao = bot.getAttribute('class');

    if (classebotao.includes('btninserido')) {
        var codhistorico = document.getElementById('span_vGRIDGEDHISTCOD_000' + String(indexbotao)).innerHTML.replace(/\s+/g, '');

        let novoNo = document.createElement('div');
        novoNo.setAttribute('class', 'mensagem');
        
        if (permissao === 0) {
            novoNo.innerHTML = `
                <p style="font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important; font-weight:normal;">
                    Você não pode alterar este Historico. Parece que ele foi inserido por outra escola!
                </p>
            `;
        } else {
            novoNo.innerHTML = `
                <p style="font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important; font-weight:normal;">
                    Tem certeza que deseja sobrescrever o histórico de ${anobotao}?
                </p>
                <input type="button" class="botaoSCT msgsim" value="Sobrescrever">
                <input type="button" class="botaoSCT msgcancela" value="Cancelar">
            `;
        }

        bot.insertAdjacentElement('afterend', novoNo);
        $('.mensagem').slideToggle();

        if (permissao !== 0) {
            document.querySelector(".msgcancela").addEventListener("click", deletarmsg);
            document.querySelector(".msgsim").addEventListener("click", function() {
                preencherFormulario(codhistorico, index);
            });
        }
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
                select = null;
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

//Funçao para exibir mensagem curta na div de LOG
function exibirLog(texto, tempo, cor = "#087EFF") {
    let divLog = document.getElementById("divlog");
    divLog.innerText = texto;
    divLog.style.color = cor; // Define a cor do texto
    $('.divlog').fadeIn(300);
    setTimeout(() => {$('.divlog').fadeOut(300);}, tempo);
}

// Função para preencher o formulário de histórico escolar
async function preencherFormulario(codhistorico, index) {
    // Verifica a permissão real antes de prosseguir
    if (codhistorico !== 1) { // Se não for um novo histórico
        let permissaoReal = permissoesHistorico.get(codhistorico);
        if (permissaoReal === 0) {
            exibirLog('Você não tem permissão para alterar este histórico!', 3000, '#FF4B40');
            voltar();
            return;
        }
    }

    exibirLog('Iniciando!', 3000);
    $('.btnajuda').fadeOut(500);
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
    let tipodeavaliacao = (!coluna[2] || !coluna[2][2] || coluna[2][2].trim() === "" || /\d/.test(coluna[2][2])) ? "NOTA" : "CONCEITO";
    let codigolotacao = document.getElementById("span_vGERLOTCOD").textContent;
    ifrIframe1.src = codhistorico == 1
        ? `http://sigeduca.seduc.mt.gov.br/ged/HWGedValidacaoHistorico.aspx?${codhistorico},${codaluno},,0,HWMGedHistorico`
        : `http://sigeduca.seduc.mt.gov.br/ged/hwtgedhistoricoescolar.aspx?${codhistorico},${codaluno},HWMGedHistorico,${codigolotacao},UPD,N`;

    atualizarProgresso(5);

    ifrIframe1.addEventListener("load", async function () {
        let iframe = parent.document.querySelector("iframe#iframe1");
        let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        iframeDoc.getElementById("vGEDHISTANO").value = coluna[0][0] || "";
        iframeDoc.getElementById("vGEDSERIECOD").value = coluna[0][1] || "";
        iframeDoc.getElementById("vGEDHISTCRGHOR").value = "";
        if (coluna[1][2]) {iframeDoc.getElementById("vGEDHISTOBS").textContent = coluna[1][2];}
        iframeDoc.getElementById("vGEDHISTNOMLOT").setAttribute("value", coluna[0][2] || "");
        iframeDoc.getElementById("vGEDHISTCIDID").setAttribute("value", coluna[0][3] || "");

        const changeEvent = new Event('change');

        let selectAvaliacao = iframeDoc.getElementById('vGEDHISTFRMAVA');
        selectAvaliacao.value = tipodeavaliacao === "NOTA" ? "3" : "2";
        selectAvaliacao.dispatchEvent(changeEvent);

        await esperar(1000);
        await esperarCarregarIframe(ifrIframe1, "#vGEDHISTTPO");

        let selectTipo = iframeDoc.getElementById('vGEDHISTTPO');
        selectTipo.value = "D";
        selectTipo.dispatchEvent(changeEvent);

        let tamanhocoluna = coluna.length;
        atualizarProgresso(5);
        let evolucao = 85 / (tamanhocoluna - 2);
        iframeDoc.querySelector(".btnIncluir")?.click();
        await esperar(2000);
        if(!coluna[2]){atualizarProgresso(100);}

        for (let linha = 2; linha < tamanhocoluna; linha++) {

            await esperar(2000);
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
            await esperar(400);
            await esperar(500);
           let elemento = tipodeavaliacao === "NOTA"
            ? iframeDoc.getElementById("vGEDHISTDISCAVANOTA")
            : iframeDoc.getElementById("vGEDHISTDISCCONSGL");
            elemento.value = tipodeavaliacao === "NOTA"
            ? (coluna[linha][2] || "").replace(/\./g, ",")
            : coluna[linha][2];
            elemento.dispatchEvent(changeEvent);

            var optionconceito = tipodeavaliacao === "CONCEITO"
            ?elemento.querySelector('option[value="'+coluna[linha][2]+'"]')
            :"é nota";
            if(!optionconceito){
                 exibirLog('Erro: Conceito informado não foi encontrado!', 20000,'#FF4B40');
                voltar();
                return;
            }

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
            selectArea = null;
            selectDisciplina = null;
            elemento = null;
            await esperar(900);

        }

        if (coluna[1][1]){
        iframeDoc.getElementById("vGEDHISTCRGHOR").value = coluna[1][1];
        iframeDoc.getElementById("vGEDHISTCRGHOR").dispatchEvent(changeEvent);
        exibirLog('Corrigindo a carga horária!', 2000);
        await esperar(600);
        iframeDoc.querySelector(".btnIncluir")?.click();
        }

        await esperar(3000);

        $('.divcarregando').slideUp(1000);
        btn.classList.remove("loading");
        exibirLog('CONCLUÍDO!', 4000,'#34A568');
        processarTextoCSV();
        tipodeavaliacao = null;
        coluna = null;
        codaluno = null;
        tamanhocoluna = null;
        evolucao = null;
        nomedadisciplina = null;
        optionconceito = null;
        selectAvaliacao = null;
        selectTipo = null;


        await esperar(3000);

        document.getElementById("loadingBtn").innerText = "0%";
        let botaoIndex = document.querySelector(`.botaoSCT[data-index="${index}"]`);
        ifrIframe1.src = "blank";
        iframe.remove();
    });
}


// Exemplo de uso:
adicionarEfeitoBrilhoFlexivel('#containerLAH', {
    delay: 1000,
    duration: 2000,
    colors: {
        before: [
            'rgba(235, 20, 20, 0.3)',
            'transparent',
            'rgba(64, 255, 166, 0.3)',
            'rgba(214, 114, 114, 0.5)',
            'transparent',
            'rgba(255, 40, 40, 0.6)'
        ],
        after: [
            'rgba(57, 130, 247, 0.5)',
            'rgba(52, 165, 104, 0.7)',
            'transparent',
            'rgba(255, 255, 255, 0.91)',
            'rgba(57, 130, 247, 0.5)'
        ]
    },
    blur: {
        before: 50,
        after: 70
    }
});

function adicionarEfeitoBrilhoFlexivel(containerSelector, options = {}) {
    // Verifica se o efeito já foi executado
    const efeitoExecutado = GM_getValue('efeitoBrilhoExecutado', false);
    if (efeitoExecutado) {
        return; // Se já foi executado, retorna sem fazer nada
    }

    // Configurações padrão
    const config = {
        delay: options.delay || 1000,
        duration: options.duration || 2000,
        colors: {
            before: options.colors?.before || [
                'rgba(235, 20, 20, 0.3)',
                'rgba(64, 255, 166, 0.3)',
                'transparent',
                'rgba(255, 40, 40, 0.6)'
            ],
            after: options.colors?.after || [
                'rgba(57, 130, 247, 0.5)',
                'rgba(52, 165, 104, 0.7)',
                'rgba(57, 130, 247, 0.5)'
            ]
        },
        blur: {
            before: options.blur?.before || 30,
            after: options.blur?.after || 50
        }
    };

    // Obtém o container
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Cria os elementos de brilho
    const glowBefore = document.createElement('div');
    const glowAfter = document.createElement('div');

    // Configura os elementos de brilho
    glowBefore.className = 'glow-layer before';
    glowAfter.className = 'glow-layer after';

    // Adiciona os estilos necessários
    const styleId = 'glow-effect-flexible-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.type = 'text/css';
        style.innerHTML = `
            .glow-layer {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                z-index: -1;
                border-radius: inherit;
                opacity: 0;
            }

            .glow-layer.before {
                animation: glow-reverse-flexible ${config.duration}ms linear;
            }

            .glow-layer.after {
                animation: glow-flexible ${config.duration}ms linear;
            }

            @keyframes glow-flexible {
                0% {
                    opacity: 0;
                    transform: scale(1);
                    background-position: 0% 0%;
                    background-size: 100% 100%;
                }
                5% {
                    opacity: 1;
                    transform: scale(1.1);
                    background-position: 100% 0%;
                    background-size: 150% 150%;
                }
                15% {
                    opacity: 0.8;
                    transform: scale(1.05);
                    background-position: 50% 100%;
                    background-size: 180% 180%;
                }
                35% {
                    opacity: 0.9;
                    transform: scale(1.03);
                    background-position: 25% 75%;
                    background-size: 200% 200%;
                }
                65% {
                    opacity: 0.7;
                    transform: scale(1.04);
                    background-position: 85% 15%;
                    background-size: 220% 220%;
                }
                85% {
                    opacity: 0.5;
                    transform: scale(1.02);
                    background-position: 35% 65%;
                    background-size: 180% 180%;
                }
                100% {
                    opacity: 0;
                    transform: scale(1);
                    background-position: 0% 0%;
                    background-size: 100% 100%;
                }
            }

            @keyframes glow-reverse-flexible {
                0% {
                    opacity: 0;
                    transform: scale(1);
                    background-position: 0% 0%;
                    background-size: 100% 100%;
                }
                5% {
                    opacity: 0.9;
                    transform: scale(1.08);
                    background-position: 0% 100%;
                    background-size: 160% 160%;
                }
                20% {
                    opacity: 1;
                    transform: scale(1.06);
                    background-position: 100% 50%;
                    background-size: 190% 190%;
                }
                45% {
                    opacity: 0.8;
                    transform: scale(1.04);
                    background-position: 75% 25%;
                    background-size: 220% 220%;
                }
                75% {
                    opacity: 0.6;
                    transform: scale(1.03);
                    background-position: 15% 85%;
                    background-size: 250% 250%;
                }
                90% {
                    opacity: 0.3;
                    transform: scale(1.01);
                    background-position: 65% 35%;
                    background-size: 280% 280%;
                }
                100% {
                    opacity: 0;
                    transform: scale(1);
                    background-position: 200% 200%;
                    background-size: 300% 300%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Configura os estilos específicos para este container
    glowBefore.style.background = `conic-gradient(from 0deg, ${config.colors.before.join(',')})`;
    glowBefore.style.filter = `blur(${config.blur.before}px)`;
    glowAfter.style.background = `conic-gradient(from 0deg, ${config.colors.after.join(',')})`;
    glowAfter.style.filter = `blur(${config.blur.after}px)`;

   // Adiciona os elementos de brilho ao container
    setTimeout(() => {
    container.appendChild(glowBefore);
    container.appendChild(glowAfter);
    }, config.delay);

    // Após a animação terminar, marca o efeito como executado
    setTimeout(() => {
        glowBefore.remove();
        glowAfter.remove();
        GM_setValue('efeitoBrilhoExecutado', true);
    }, config.duration+config.delay);
}
