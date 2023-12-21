// 1.Cargar desde un archivo CSV la estructura nombre-mms descrita anteriormente. En el anexo
//se proporciona un ejemplo completo.

const fs = require('fs');
const csv = require('csv-parser');

// Definir una función para cargar los datos desde el archivo CSV
function cargarDatosDesdeCSV(rutaArchivo) {
    return new Promise((resolve, reject) => {
      const signals = [];
  
      fs.createReadStream(rutaArchivo)
        .pipe(csv())
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

  // Llamar a la función para cargar los datos
const rutaArchivoCSV = './archivo de entrada.csv'; 

cargarDatosDesdeCSV(rutaArchivoCSV)
  .then((signals) => {
    console.log('Datos cargados exitosamente:');
    console.table(signals);
    
  })
  .catch((error) => {
    console.error('Error al cargar los datos:', error);
  });