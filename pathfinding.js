let escenario;
let canvas, ctx, anchoT, altoT;
let openSet = [];
let closedSet = [];
let camino = [];
let principio, fin;
let terminado = false;

export function inicializa() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    anchoT = canvas.width / 10;  // Tamaño de cada celda en píxeles
    altoT = canvas.height / 10;

    escenario = crearArray2d(10, 10);

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            escenario[i][j] = new Casilla(i, j);
        }
    }

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            escenario[i][j].addVecinos(); // Añade a los vecinos de cada casilla
        }
    }

    principio = escenario[0][0];
    fin = escenario[9][9];

    openSet = [];
    closedSet = [];
    camino = [];
    terminado = false;

    openSet.push(principio); // Debe comenzar a evaluar nodos a partir del nodo inicial

    dibujaEscenario();
}

function crearArray2d(filas, columnas) {
    let arr = new Array(filas);
    for (let i = 0; i < filas; i++) {
        arr[i] = new Array(columnas);
    }
    return arr;
}

class Casilla {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.tipo = 0; // 0: carretera, 1: vivienda, 2: agua, 3: obstrucción
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.vecinos = [];
        this.padre = null; // La casilla anterior en el camino
    }

    addVecinos() {
        if (this.x > 0) this.vecinos.push(escenario[this.x - 1][this.y]); // Añade el vecino de la izquierda si existe.
        if (this.x < 9) this.vecinos.push(escenario[this.x + 1][this.y]); // Añade el vecino de la derecha si existe
        if (this.y > 0) this.vecinos.push(escenario[this.x][this.y - 1]); // Añade el vecino de arriba si existe
        if (this.y < 9) this.vecinos.push(escenario[this.x][this.y + 1]); // Añade el vecino de abajo si existe.
    }

    dibuja() {
        if (this === principio) {
            ctx.fillStyle = '#00FF00'; // Casilla color verde para el principio
        } else if (this === fin) {
            ctx.fillStyle = '#FF0000'; // Casilla color Rojo para el fin
        } else {
            ctx.fillStyle = this.tipo === 0 ? '#777777' : this.tipo === 1 ? '#FF00FF' : this.tipo === 2 ? '#2986cc' : '#145a32'; // Pinta la casilla de diferentes colores según su tipo.
        }
        ctx.fillRect(this.x * anchoT, this.y * altoT, anchoT, altoT); //  Dibuja la casilla en el canvas.
        ctx.strokeRect(this.x * anchoT, this.y * altoT, anchoT, altoT); // Añadimos borde para ver la cuadrícula
    }
}

export function agregarObstaculo(i, j, tipo) {
    if (i >= 0 && i < 10 && j >= 0 && j < 10) {
        escenario[i][j].tipo = tipo;
    } else {
        alert('Las coordenadas están fuera de los límites del escenario.');
    }
}

export function dibujaEscenario() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            escenario[i][j].dibuja();
        }
    }
    // Dibuja el camino si se ha encontrado
    for (let i = 0; i < camino.length; i++) {
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(camino[i].x * anchoT, camino[i].y * altoT, anchoT, altoT);
    }
}

function heuristica(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function iniciarAlgoritmo() { // Si la lista de celdas abiertas está vacía, añade la celda de inicio.
    if (openSet.length === 0) {
        openSet.push(principio);
    }
    setInterval(algoritmo, 1000 / 60); // Llama a la función algoritmo 60 veces por segundo.
}

function algoritmo() {
    if (terminado) return;

    if (openSet.length > 0) { // Si hay celdas por revisar, inicializa el indice del mejor camino
        let ganador = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[ganador].f) ganador = i; //  Encuentra la celda con el valor f más bajo.
        }

        let actual = openSet[ganador];

        if (actual === fin) {
            console.log('Camino encontrado');
            let temp = actual;
            camino = [];
            while (temp.padre) {
                camino.push(temp);
                temp = temp.padre;
            }
            camino.push(principio);  // Añade la celda de inicio y marca el camino como encontrado.
            terminado = true;
        } else { // Si la celda actual no es la celda final
            openSet.splice(ganador, 1);
            closedSet.push(actual);

            let vecinos = actual.vecinos; // Obtiene los vecinos de la celda actual
            for (let i = 0; i < vecinos.length; i++) {
                let vecino = vecinos[i];

                if (!closedSet.includes(vecino) && vecino.tipo !== 1 && vecino.tipo !== 2 && vecino.tipo !== 3) {
                    let tempG = actual.g + 1;
                    if (openSet.includes(vecino)) {
                        if (tempG < vecino.g) vecino.g = tempG;
                    } else {
                        vecino.g = tempG;
                        openSet.push(vecino);
                    }

                    vecino.h = heuristica(vecino, fin);
                    vecino.f = vecino.g + vecino.h;
                    vecino.padre = actual;
                }
            }
        }
    } else {
        console.log('No hay un camino posible');
        terminado = true;
    }

    dibujaEscenario();
}
