
export class Credito { // class ArchivoPost tendría que ser...
    usuario_id: number;         // id del usuario de la foto
    voto: number;              // fecha y hora de la subida
    opcion: string;               // descripción del voto

    constructor(voto: number, opcion?: string) {
        this.voto = voto;
        if(opcion!==undefined)
        this.opcion = opcion;
        
    }
  
    dameJSON() {
        return JSON.parse( JSON.stringify(this));
    }
}
