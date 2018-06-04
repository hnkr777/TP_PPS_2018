

export class vehiculo {
    public patente:string;
    public modelo:string;
    public color:string;
    public fotos:Array<string>[];
    public activo: string;
    constructor(patente,modelo,color){
        this.patente = patente;
        this.modelo = modelo;
        this.color = color;
        this.fotos = new Array();
        this.activo = "1";
    }
  
    dameJSON() {
      return JSON.parse( JSON.stringify(this));
    }
}
