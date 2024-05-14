const readlineSync = require('readline-sync');

class VehiculoTransporte {
    constructor(conductor, generoConductor, ciudadOrigen, ciudadDestino, consumoGasolina, toneladasCarga) {
        this.conductor = conductor;
        this.generoConductor = generoConductor;
        this.ciudadOrigen = ciudadOrigen;
        this.ciudadDestino = ciudadDestino;
        this.consumoGasolina = consumoGasolina;
        this.toneladasCarga = toneladasCarga;
    }
}

class Tractomula extends VehiculoTransporte {
    constructor(conductor, generoConductor, ciudadOrigen, ciudadDestino, consumoGasolina, toneladasCarga, modelo, avaluo, marca, anosAntiguedad) {
        super(conductor, generoConductor, ciudadOrigen, ciudadDestino, consumoGasolina, toneladasCarga);
        this.modelo = modelo;
        this.avaluo = avaluo;
        this.marca = marca;
        this.anosAntiguedad = anosAntiguedad;
    }

    calcularImpuesto() {
        if (this.toneladasCarga <= 5) {
            return 0.05;
        } else if (this.toneladasCarga <= 10) {
            return 0.07;
        } else if (this.toneladasCarga <= 15) {
            return 0.12;
        } else {
            return 0.20;
        }
    }

    calcularComision(distancia) {
        let comision = 0;
        if (distancia > 1000) {
            comision = 0.05 * Math.floor(distancia / 1000);
            if (this.anosAntiguedad > 5) {
                comision *= 1.07;
            }
        }
        return comision;
    }
}

class Viaje {
    constructor(vehiculo, distancia, tipoCarga, precioKg) {
        this.vehiculo = vehiculo;
        this.distancia = distancia;
        this.tipoCarga = tipoCarga;
        this.precioKg = precioKg;
    }

    calcularPrecioViaje() {
        const impuesto = this.vehiculo.calcularImpuesto();
        const costoTransporte = this.distancia * this.precioKg * this.vehiculo.toneladasCarga;
        const total = costoTransporte * (1 + impuesto);
        const comision = this.vehiculo.calcularComision(this.distancia);
        return total + comision;
    }
}

class ControladorViajes {
    constructor() {
        this.viajes = [];
    }

    crearViaje() {
        const nombreConductor = readlineSync.question('Nombre del conductor: ');
        const generoConductor = readlineSync.question('Genero del conductor (m/f): ');
        const ciudadOrigen = readlineSync.question('Ciudad de origen: ');
        const ciudadDestino = readlineSync.question('Ciudad de destino: ');
        const consumoGasolina = parseFloat(readlineSync.question('Consumo de gasolina por kilometro del camion: '));
        const distanciaViaje = parseInt(readlineSync.question('Distancia del viaje (en km): '));
        const avaluoCamion = parseInt(readlineSync.question('Avaluo del camion: '));
        const marcaCamion = readlineSync.question('Marca del camion: ');
        const antiguedadCamion = parseInt(readlineSync.question('Anos de antiguedad del camion: '));
        const pesoCarga = parseFloat(readlineSync.question('Peso de la carga (en toneladas): '));
        const tipoCarga = readlineSync.question('Tipo de carga (Alimentos/Hierro/Cemento/Electrodomesticos/Otro): ');
        const precioCarga = parseFloat(readlineSync.question('Precio por kilogramo de la carga (en $): '));

        const viaje = new Viaje(
            new Tractomula(
                nombreConductor,
                generoConductor,
                ciudadOrigen,
                ciudadDestino,
                consumoGasolina,
                pesoCarga,
                antiguedadCamion,
                avaluoCamion,
                marcaCamion,
                pesoCarga
            ),
            distanciaViaje,
            tipoCarga,
            precioCarga
        );
        this.registrarViaje(viaje);

        let continuar = false;
        while (true) {
            const respuesta = readlineSync.question('Desea agregar otro viaje? (S/N): ').toUpperCase();
            if (respuesta === 'S') {
                continuar = true;
                break;
            } else if (respuesta === 'N') {
                continuar = false;
                break;
            } else {
                console.log('Por favor, ingrese una opción válida (S/N).');
            }
        }

        if (continuar) {
            this.crearViaje();
        }
    }

    registrarViaje(viaje) {
        const precioViaje = viaje.calcularPrecioViaje();
        console.log(`El precio del viaje es: ${precioViaje} pesos`);
        this.viajes.push(viaje);
    }

    calcularDineroTotalRecaudado() {
        let totalRecaudado = 0;
        for (const viaje of this.viajes) {
            totalRecaudado += viaje.calcularPrecioViaje();
        }
        return totalRecaudado;
    }

    calcularTipoCargaMasImpuestos() {
        const impuestosPorTipoCarga = {};
        for (const viaje of this.viajes) {
            const tipoCarga = viaje.tipoCarga;
            if (!(tipoCarga in impuestosPorTipoCarga)) {
                impuestosPorTipoCarga[tipoCarga] = 0;
            }
            impuestosPorTipoCarga[tipoCarga] += viaje.vehiculo.calcularImpuesto();
        }
        let maxImpuestos = -1;
        let tipoCargaMasImpuestos = '';
        for (const tipoCarga in impuestosPorTipoCarga) {
            if (impuestosPorTipoCarga[tipoCarga] > maxImpuestos) {
                maxImpuestos = impuestosPorTipoCarga[tipoCarga];
                tipoCargaMasImpuestos = tipoCarga;
            }
        }
        return tipoCargaMasImpuestos;
    }

    calcularPromedioGananciaPorTipoCarga(tipoCarga) {
        let totalGanancias = 0;
        let cantidadViajes = 0;
        for (const viaje of this.viajes) {
            if (viaje.tipoCarga === tipoCarga) {
                totalGanancias += viaje.calcularPrecioViaje();
                cantidadViajes++;
            }
        }
        return cantidadViajes > 0 ? totalGanancias / cantidadViajes : 0;
    }

    calcularMarcaCamionMenosGasolina() {
        let minGasolina = 1000000000;
        let marcaMenosGasolina = '';
        const marcas = {};
        for (const viaje of this.viajes) {
            const marca = viaje.vehiculo.marca;
            if (!(marca in marcas)) {
                marcas[marca] = 0;
            }
            marcas[marca] += viaje.vehiculo.consumoGasolina;
            if (marcas[marca] < minGasolina) {
                minGasolina = marcas[marca];
                marcaMenosGasolina = marca;
            }
        }
        return marcaMenosGasolina;
    }

    calcularDineroTotalComisiones() {
        let totalComisiones = 0;
        for (const viaje of this.viajes) {
            totalComisiones += viaje.vehiculo.calcularComision(viaje.distancia);
        }
        return totalComisiones;
    }

    calcularGananciasConductor(nombreConductor) {
        let gananciasTransportes = 0;
        let gananciasComisiones = 0;
        for (const viaje of this.viajes) {
            if (viaje.vehiculo.conductor === nombreConductor) {
                gananciasTransportes += viaje.calcularPrecioViaje();
                gananciasComisiones += viaje.vehiculo.calcularComision(viaje.distancia);
            }
        }
        return { gananciasTransportes, gananciasComisiones };
    }

    calcularResultadosFinales() {
        console.log('Dinero total recaudado por concepto de viajes realizados:', this.calcularDineroTotalRecaudado());
        console.log('Tipo de carga que genera más impuestos:', this.calcularTipoCargaMasImpuestos());
        console.log('Promedio de ganancia por viajes de Alimentos:', this.calcularPromedioGananciaPorTipoCarga('Alimentos'));
        console.log('Promedio de ganancia por viajes de Hierro:', this.calcularPromedioGananciaPorTipoCarga('Hierro'));
        console.log('Promedio de ganancia por viajes de Cemento:', this.calcularPromedioGananciaPorTipoCarga('Cemento'));
        console.log('Marca de camión que menos gasolina consume:', this.calcularMarcaCamionMenosGasolina());
        console.log('Dinero total en comisiones:', this.calcularDineroTotalComisiones());
        const nombreConductor = this.viajes[0].vehiculo.conductor;
        console.log(`Ganancias totales del conductor ${nombreConductor}:`, this.calcularGananciasConductor(nombreConductor).gananciasTransportes);
        console.log(`Ganancias por comisiones del conductor ${nombreConductor}:`, this.calcularGananciasConductor(nombreConductor).gananciasComisiones);
    }
}

const controlador = new ControladorViajes();
controlador.crearViaje();
controlador.calcularResultadosFinales();