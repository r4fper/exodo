/*Conjunto de funciones que manipulan la captura y análisis de las imagenes */

//Temporizador que inica al cargar la pagina
var temporizador;
var temporizador2;
//vector de Enemmigos 
var vEnemigos = new Array();
//Objeto que contiene la imagen desplegada por la webcam
var oImagen = new Imagen();
//Coordenada inicial de pixeles en X el objeto a mover
var pixeles = 200;

function activarTemporizador() {
    detenerTemporizador2();
    oImagen = new Imagen(800, 600, document.getElementById('webCam'), document.getElementById('foto'));
    temporizador = setInterval(function () {
        oImagen.capturar();
        oImagen.analizar();
        atacar();
    }, 10);
}

function inicializar() {
    var oCamara = new CamaraVideo(document.getElementById("webCam"));
    oCamara.usarCamara();
    activarTemporizador();
    vEnemigos.push(new enemigo(40, 250, 50, 50, document.getElementById('foto')));
    vEnemigos.push(new enemigo(200, 300, 50, 50, document.getElementById('foto')));
    vEnemigos[0].dibujar();
    vEnemigos[1].dibujar();
}


function detenerTemporizador() {
    clearTimeout(temporizador);
}
function detenerTemporizador2() {
//    document.getElementById('indicaciones').style.backgroundImage = null;
    clearTimeout(temporizador2);
}

function activarTemporizador2() {
    temporizador2 = setInterval(function () {
        activarTemporizador();
    }, 500);
}

function atacar() {
    for (i = 0; i < vEnemigos.length; i++) {
        vEnemigos[i].mover();
        if (vEnemigos[i].y < 10) {
            //Se destruye el enemigo
            vEnemigos[i].destruir();
            //Se elimina el objeto del vector de enemigos
            vEnemigos.splice(i, 1);
        }
    }
}