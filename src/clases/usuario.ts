
/* Evitamos la herencia por un tema de practicidad y falta de tiempo...
 * lo que define a cada tipo de usuario es el perfil (cliente, chofer, supervisor, admin)
 */

export class Usuario {
    id: number;         // identificador numérico, de uso interno para la app
    nombre: string;     // email segun la consigna...
    apellido: string;
    email: string;
    fechaNacimiento: Date;  // revisar si está bien este tipo de dato para la fecha de nacimiento...
    fechaAlta: Date;        // acá lo mismo...
    clave: string;      // contraseña
    perfil: string;     // puede ser: cliente, supervisor, chofer, admin (superusuario)
    sexo: string;       // puede ser 'f' = femenino | 'm' = masculino
    activo: number;     // 0 = inactivo, 1 = activo
    foto: string;       // foto en base64
    dni: number;        // DNI, es un número
  
    constructor(){
      this.fechaAlta = new Date(Date.now());
    }
  
    /*toJSON() {
      return JSON.parse( JSON.stringify(this));
    }*/
}
