
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
  
    constructor(){
      
    }
  
    dameJSON() {
      return JSON.parse( JSON.stringify(this));
    }
}
