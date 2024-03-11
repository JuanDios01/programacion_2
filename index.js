const readlineSync = require('readline-sync');

let CodigoMaleta = 0 ;
let NumeroVuelo = 0 ;
let OrigenMaleta = 0 ;
let Genero = 0 ;
let PesoMaleta = 0 ;
let CostoTotal = 0 ;
let DestinoMaleta = 0 ; 
let destinoMasMaletas = '';
let maxMaletas = 0;
let TotalDescuento = 0 ;
let pesoTotalMaletas = 0;
let pesoMaletaMasPesada = 0;
let pesoTotalMaletasM = 0;
let pesoTotalMaletasF = 0;
let totalMaletasM = 0;
let totalMaletasF = 0;
const maletasPorDestino = { 'san andres': 0,'pereira': 0,'medellin': 0,'manizales': 0,'barranquilla': 0,'bogota': 0,'cali': 0,};
const Descuento = 0 ;
const CostoNormalMaleta = 20000 ;
const CostoAdicionalMaleta = 5000 ;
const PesoMaximo = 23 ;



function RegistrarMaleta(numeroMaleta) {
    console.log(`--- Maleta ${numeroMaleta} ---`);


//pedir el codigo de la maleta
    let CodigoMaleta = readlineSync.question(`Ingrese el codigo de la maleta:`);
    if(CodigoMaleta.length <= 0 || isNaN(CodigoMaleta)){
        console.error(`el codigo de la maleta no puede ser un valor cero, negativo o una letra`);
        return; // Si hay un error, termina la función aquí
    }
    else {
        console.info(`el codigo de la maleta se registro. Codigo ${CodigoMaleta}`);
    }
//pedir el numero de vuelo
    let NumeroVuelo = readlineSync.question(`Ingrese el numero de vuelo:`);
    if (NumeroVuelo.length <= 0 || isNaN(NumeroVuelo)){
        console.error(`el codigo de la maleta no puede ser un valor cero, negativo o una letra`);
        return;
    }
    else {
        console.info(`el numero de vuelo se registro. numero ${NumeroVuelo}`);
    }
//pedir el origen de la maleta
    let OrigenMaleta = readlineSync.question(`Ingrese el origen de la maleta:`);
    if (OrigenMaleta.length <= 0 || !isNaN(OrigenMaleta)){
        console.error(`el origen de la maleta no puede estar vacio y no puede ser un numero`);
        return;
    }
    else {
        console.info(`el origen de la maleta se registro. Origen ${OrigenMaleta}`);
    }
//pedir el peso de la maleta
    let PesoMaleta = readlineSync.question(`Ingrese el peso de la maleta en kilos:`);
    PesoMaleta = Number(PesoMaleta);
    if (PesoMaleta <= 0 || isNaN(PesoMaleta)){
        console.error(`el peso de la maleta no puede estar vacio y no puede ser una letra`);
        return;
    }
    else {
        if (PesoMaleta > pesoMaletaMasPesada) {
            pesoMaletaMasPesada = PesoMaleta;
        }

        pesoTotalMaletas += PesoMaleta;
        if (PesoMaleta > PesoMaximo){
            CostoTotal = (PesoMaleta - PesoMaximo) * CostoAdicionalMaleta + CostoNormalMaleta ;
            console.info ( `su maleta tiene un peso de ${PesoMaleta} excediendo los 23kg bases, el coste total es de ${CostoTotal}`)
        }
        else {
            CostoTotal = CostoNormalMaleta;
            console.info(`el peso de la maleta se registro. peso ${PesoMaleta}`);   
        }
    }
//pedir el destino de la maleta
    let DestinoMaleta = readlineSync.question(`Ingrese el destino de la maleta "cali, san andres, pereira, medellin, manizales, barranquilla, bogota":`);
        if (DestinoMaleta.length <= 0 || !isNaN(DestinoMaleta) || !(DestinoMaleta in maletasPorDestino)){
            console.error(`el destino de la maleta no puede estar vacio, no puede ser diferente a los disponibles y no puede ser un numero`);
            return;
        }
        else { maletasPorDestino[DestinoMaleta]++;
            if (DestinoMaleta === 'cali') {
                const TotalDescuento = CostoTotal * 0.85; 
                const Descuento = TotalDescuento-CostoTotal;
                console.info(`Cali tiene un descuento del 15%, el descuento es por $${Descuento} y su costo total con descuento es: $${TotalDescuento}`);
            } else {
                console.info(`el destino de la maleta se registro. Destino ${DestinoMaleta}`);
                console.info(`Costo total sin descuento: $${CostoTotal}`);
            }
        }
//pedir el genero del dueño
let Genero = readlineSync.question(`Ingrese el genero (f/m):`);
if (Genero.length <= 0 || !isNaN(Genero) || (Genero.toLowerCase() !== 'f' && Genero.toLowerCase() !== 'm')){
    console.error(`el genero no puede estar vacio, no puede ser un numero y debe ser m(masculino) o f(femenino)`);
    return; // Si hay un error, termina la función aquí
}
else {
    console.info(`el genero del dueño de la maleta se registro. genero ${Genero}`);
    if (Genero.toLowerCase() === 'm') {
        pesoTotalMaletasM += PesoMaleta;
        totalMaletasM++;
    } else {
        pesoTotalMaletasF += PesoMaleta;
        totalMaletasF++;
    }
}
}

//contador de maletas
for (let i = 1; i <= 5; i++) {
    RegistrarMaleta(i);
}

//encontrar el destino que tiene la mayor cantidad de maletas despachadas.
for (const destino in maletasPorDestino) {
    if (maletasPorDestino[destino] > maxMaletas) {
        maxMaletas = maletasPorDestino[destino];
        destinoMasMaletas = destino;
    }
}

//promedio de maletas con respecto a m/f
let promedioPesoMaletasM = pesoTotalMaletasM / totalMaletasM;
let promedioPesoMaletasF = pesoTotalMaletasF / totalMaletasF;
console.info(`Promedio del peso de las maletas para el género masculino: ${promedioPesoMaletasM} kg`);
console.info(`Promedio del peso de las maletas para el género femenino: ${promedioPesoMaletasF} kg`);

//destino con mayor numero de maletas
console.info(`Destino con más maletas despachadas: ${destinoMasMaletas}`);

//la maleta más pesada en el vuelo
console.info(`Peso de la maleta más pesada: ${pesoMaletaMasPesada} kg`);

//peso total de todas las maletas
console.info(`Peso total de las maletas: ${pesoTotalMaletas} kg`)