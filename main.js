import { inicializa, dibujaEscenario, agregarObstaculo, iniciarAlgoritmo } from './pathfinding.js';

let canvas, ctx, anchoT, altoT;
let obstaculoTipo;
let seleccionPendiente = false;

window.onload = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    document.getElementById("vivienda").onclick = () => {
        if (seleccionPendiente) {
            mostrarMensajeError("Debes seleccionar una celda para el obstáculo antes de elegir otro.");
        } else {
            obstaculoTipo = 1;
            seleccionPendiente = true;
            mostrarMensaje("Selecciona una celda para la vivienda.");
        }
    };
    document.getElementById("agua").onclick = () => {
        if (seleccionPendiente) {
            mostrarMensajeError("Debes seleccionar una celda para el obstáculo antes de elegir otro.");
        } else {
            obstaculoTipo = 2;
            seleccionPendiente = true;
            mostrarMensaje("Selecciona una celda para el agua.");
        }
    };
    document.getElementById("obstruccion").onclick = () => {
        if (seleccionPendiente) {
            mostrarMensajeError("Debes seleccionar una celda para el obstáculo antes de elegir otro.");
        } else {
            obstaculoTipo = 3;
            seleccionPendiente = true;
            mostrarMensaje("Selecciona una celda para la obstrucción.");
        }
    };
    document.getElementById("inicio").onclick = iniciarAlgoritmo;

    document.getElementById("agregar-obstaculo").onclick = () => {
        if (!seleccionPendiente) {
            mostrarMensajeError("Selecciona un tipo de obstáculo antes de ingresar las coordenadas.");
            return;
        }

        let xCoord = parseInt(document.getElementById("x-coord").value); 
        let yCoord = parseInt(document.getElementById("y-coord").value);

        if (isNaN(xCoord) || isNaN(yCoord) || xCoord < 0 || xCoord > 9 || yCoord < 0 || yCoord > 9) {
            mostrarMensajeError("Por favor, ingresa coordenadas válidas entre 0 y 9.");
            return;
        }

        agregarObstaculo(xCoord, yCoord, obstaculoTipo);
        dibujaEscenario();
        seleccionPendiente = false;
        obstaculoTipo = undefined;
        mostrarMensaje("Obstáculo agregado. Selecciona otro obstáculo o inicia el algoritmo.");
    };

    inicializa();
};

function mostrarMensajeError(mensaje) {
    document.getElementById("message").textContent = mensaje;
    document.getElementById("message").style.color = "red";
}

function mostrarMensaje(mensaje) {
    document.getElementById("message").textContent = mensaje;
    document.getElementById("message").style.color = "green";
}
