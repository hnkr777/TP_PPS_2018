
import { DateTime } from "ionic-angular";

export class ArchivoPost {
    usuario_id: number;         // id del usuario de la foto
    fecha: number;              // fecha y hora de la subida
    path: string;               // descripción del voto

    constructor(path: string, id: number) {
        this.fecha = Date.now();
        this.usuario_id = id;
        this.path = path+'/user_ID_'+id.toString()+'/'+this.fecha.toString()+'.jpg';
    }
  
    dameJSON() {
        return JSON.parse( JSON.stringify(this));
    }
}
