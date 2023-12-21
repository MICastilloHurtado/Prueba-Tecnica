// 1.Cargar desde un archivo CSV la estructura nombre-mms descrita anteriormente.

const fs = require('fs');
const csv = require('csv-parser');

// Definir una función para cargar los datos desde el archivo CSV
function cargarDatosDesdeCSV(rutaArchivo) {
    return new Promise((resolve, reject) => {
        const signals = [];

        fs.createReadStream(rutaArchivo)
            .pipe(csv({ separator: ';' }))
            .on('data', (row) => {
                signals.push(row);
            })
            .on('end', () => {
                resolve(signals);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}




// 2.Permitir visualizar en forma del árbol el modelo de información dado en la entrada.

// Función para mostrar el árbol de información
function mostrarArbol(signals) {
    console.log('Árbol de información:');

    // Agrupar señales por niveles
    const niveles = {};

    signals.forEach((senal) => {
        const partes = senal.MMSPATH.split('/');
        let nivelActual = niveles;

        partes.forEach((parte, index) => {
            if (!nivelActual[parte]) {
                nivelActual[parte] = {};
            }

            nivelActual = nivelActual[parte];

            // Agregar la señal al último nivel
            if (index === partes.length - 1) {
                nivelActual[senal.NOMBRE] = null;
            }
        });
    });

    // Función para imprimir recursivamente los niveles
    function imprimirNiveles(niveles, nivel = 0) {
        for (const [nombre, subNiveles] of Object.entries(niveles)) {
            const indentacion = '  '.repeat(nivel);
            console.log(`${indentacion}${nombre}`);
            if (subNiveles) {
                imprimirNiveles(subNiveles, nivel + 1);
            }
        }
    }

    imprimirNiveles(niveles);
}

// Llamar a la función para cargar los datos
const rutaArchivoCSV = './archivo de entrada.csv';

// Cargar los datos y luego mostrar el árbol
cargarDatosDesdeCSV(rutaArchivoCSV)
    .then((signals) => {
        console.log('Datos cargados exitosamente:');
        console.table(signals);

        // Llamar a la función para mostrar el árbol
        mostrarArbol(signals);
    })
    .catch((error) => {
        console.error('Error al cargar los datos:', error);
    });
    



// 3. Implementar una opción de búsqueda que permita filtrar las señales dadas usando
//expresiones regulares aplicadas a la columna MMSPATH.