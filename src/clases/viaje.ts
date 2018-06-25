
export class Viaje {
  id: number;                           // debería tener identificador?  
  
  latOrigen: number;                     // coordenadas de longitud y latitud del api google maps, la ingresa por el mapa el cliente o la devuelve el api en base a la direccion ingresada por el cliente
  longOrigen: number;
  
  latDestino: number;                    // coordenadas longitud y latitud del api google maps, la ingresa por el mapa el cliente o la devuelve el api en base a la direccion ingresada por el cliente
  longDestino: number;
  
  origen: string;                       // string con la direccion de origen del viaje, la que ingresa el cliente o asigna gmaps
  destino: string;                      // string con la direccion de destino del viaje, la que ingresa el cliente o asigna gmaps
  
  // fechas un formato UNIX epoch, cantidad de milisegundos desde el 01/01/1970
  fechaRegistro: number;                  // fecha y hora de cuando se registra el viaje, lo asigna el constructor de la clase
  fechaSalida: number;                    // fecha inmediata (en la próxima media hora) o postdatada, a partir de ese horario el viaje puede ser realizado por algún chofer
  
  correoCliente: string;                // direccion del cliente que pidió el viaje
  nombreCliente: string;                // nombre y apellido del cliente que pidió el viaje
  correoChofer: string;                 // identificador del chofer que realizó/realiza el viaje, sino tiene, el viaje está disponible para realizarse
  patente: string;                      // que vehículo tendrá asignado el viaje, se setea en cuanto un chofer toma el viaje... información redundante pero puede servir
  monto: number;                        // costo del viaje, se calcula en base a la distancia del viaje
  pagado: number;                       // variable de estado del pago del viaje: 1 = viaje pagado, 0 = viaje en deuda a cuenta corriente ...
  fechaFinalizacion;                    // Fecha y hora de finalización del viaje, se usa como variable de control, si es undefined el viaje todavía no se realizó/terminó, se puede usar para calcular la duración real del viaje
  duracionViaje: number;                // calculado del api gps google maps, es un estimado
  duracionViajeText: string;            // calculado del api gps google maps, es un estimado
  estado: number;                       // estado general/auxiliar del viaje: usado para múltiples propósitos en la app
  distancia: number;                    // distancia en metros, sacado de google maps
  distanciaText: string;                // distancia en texto, sacado de google maps
  
  fechaRegistroString: string;              // Guardan la fecha en hora local y humana
  fechaSalidaString: string;                // Guardan la fecha en hora local y humana

  constructor() {
    this.fechaRegistro = Date.now();
    this.correoChofer = "";
    this.estado = 0;
    this.fechaRegistroString = this.getFechaRegistro();
    if(this.fechaSalida !== undefined) {
      this.fechaSalidaString = this.getFechaSalida();
    } else {
      this.fechaSalidaString = "";
    }
  }

  public getFechaSalida(): string {
    let f: Date = new Date(this.fechaSalida);
    this.fechaSalidaString = f.toLocaleString();
    return this.fechaSalidaString;
  }
  
  public getFechaRegistro(): string {
    let f: Date = new Date(this.fechaRegistro);
    this.fechaRegistroString = f.toLocaleString();
    return this.fechaRegistroString;
  }

  public setFechaSalida(fechaUnix: number) {
    this.fechaSalida = fechaUnix;
    let f: Date = new Date(this.fechaSalida);
    this.fechaSalidaString = f.toLocaleString();
  }
  
  public setFechaRegistro(fechaUnix: number) {
    this.fechaRegistro = fechaUnix;
    let f: Date = new Date(this.fechaRegistro);
    this.fechaRegistroString = f.toLocaleString();
  }


  /*toJSON() {
    return JSON.parse( JSON.stringify(this));
  }*/
}
