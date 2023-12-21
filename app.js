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





// 3. Implementar una opción de búsqueda que permita filtrar las señales dadas usando
//expresiones regulares aplicadas a la columna MMSPATH.

function filtrarSenalesPorExpresionRegular(signals, expresionRegular) {
    const expresion = new RegExp(expresionRegular, 'i'); // 'i' para hacer la búsqueda insensible a mayúsculas/minúsculas

    return signals.filter((senal) => expresion.test(senal.MMSPATH));
}




// 4.Definir una función que retorne un número que mida la capacidad de una expresión de
//entrada para filtrar una señal y excluir el resto.

function medirCapacidadExpresion(expresion, signals) {
    const expresionRegex = new RegExp(expresion, 'i');
    const coincide = signals.filter((senal) => expresionRegex.test(senal.MMSPATH));
    const noCoincide = signals.filter((senal) => !expresionRegex.test(senal.MMSPATH));

    const capacidad = Math.min(coincide.length, noCoincide.length);
    return capacidad;
}




// 5. Proponer para cada señal dadas, una expresión óptima para filtrarla. Una expresión es
// óptima cuando usa el número mínimo de caracteres.

function proponerExpresionOptima(signals) {
    const expresionesOptimas = {};

    signals.forEach((senal) => {
        let expresionOptima = '';

        for (let i = 0; i < senal.MMSPATH.length; i++) {
            const substring = senal.MMSPATH.substring(0, i + 1);
            const capacidad = medirCapacidadExpresion(substring, signals);

            if (capacidad === 1) {
                expresionOptima = substring;
                break;
            }
        }

        expresionesOptimas[senal.NOMBRE] = expresionOptima;
    });

    return expresionesOptimas;
}

const rutaArchivoCSV = './archivo de entrada.csv';

cargarDatosDesdeCSV(rutaArchivoCSV)
    .then((signals) => {
        console.log('Datos cargados exitosamente:');
        console.table(signals);

        // Llamar a la función para mostrar el árbol
        mostrarArbol(signals);

        // 3. Implementar una opción de búsqueda que permita filtrar las señales dadas usando
        // expresiones regulares aplicadas a la columna MMSPATH.
        const expresionRegular = 'AXONBAYApplication';
        const senalesFiltradas = filtrarSenalesPorExpresionRegular(signals, expresionRegular);

        console.log(`Señales filtradas por la expresión regular "${expresionRegular}":`);
        console.table(senalesFiltradas);

        // 4. Definir una función que retorne un número que mida la capacidad de una expresión de entrada
        // para filtrar una señal y excluir el resto.
        const capacidadExpresion = medirCapacidadExpresion(expresionRegular, signals);
        console.log(`Capacidad de la expresión regular "${expresionRegular}": ${capacidadExpresion}`);

        // 5. Proponer para cada señal dada una expresión óptima para filtrarla.
        const expresionesOptimas = proponerExpresionOptima(signals);

        console.log('Expresiones óptimas para cada señal:');
        console.table(expresionesOptimas);
    })
    .catch((error) => {
        console.error('Error al cargar los datos:', error);
    });