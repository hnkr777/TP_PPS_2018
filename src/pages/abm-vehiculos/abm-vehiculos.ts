import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { ServicioFotosProvider } from "../../providers/servicio-fotos/servicio-fotos";
import { ServicioAudioProvider } from "../../providers/servicio-audio/servicio-audio";
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { vehiculo } from "../../clases/vehiculo";
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the AbmVehiculosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-abm-vehiculos',
  templateUrl: 'abm-vehiculos.html',
})
export class AbmVehiculosPage {
  abmMostrar  = "";
  foto1 = "no";
  foto2 = "no";
  foto3 = "no";
  is2016 = true;
  public vehiculo = {
    patente: "",
    modelo: "",
    color: "",
    fotos: [],
    activo: "1"
    //qr: "",
  }
  patenteCampo1 = "";
  patenteCampo2 = "";
  patenteCampo3 = "";
  patenteABuscar = "";
  patenteEncontrada = false;
  coleccionTipadaFirebase:AngularFirestoreCollection<vehiculo>;
  ListadoDeVehiculosObservable:Observable<vehiculo[]>;
  ListaDeVehiculos:Array<vehiculo>;
  constructor(public navCtrl: NavController,public audioService:ServicioAudioProvider, public navParams: NavParams,public servicioFotos: ServicioFotosProvider,public alertCtrl: AlertController,private objFirebase: AngularFirestore) {
    this.abmMostrar = this.navParams.get('data');
    if (this.abmMostrar == "Alta") {
      this.vehiculo.fotos = new Array();
    }
    this.ListaDeVehiculos = new Array();
  }

  ionViewDidLoad() {
    this.coleccionTipadaFirebase= this.objFirebase.collection<vehiculo>('vehiculos'); 
    //para el filtrado mirar la documentación https://firebase.google.com/docs/firestore/query-data/queries?authuser=0
    this.ListadoDeVehiculosObservable=this.coleccionTipadaFirebase.valueChanges();
    this.ListadoDeVehiculosObservable.subscribe(x => {
        console.info("conexión correcta con Firebase",x);
        this.ListaDeVehiculos = new Array();
        x.forEach(vehiculo => {
          this.ListaDeVehiculos.push(vehiculo);
        });
    })
    console.log("fin de ionViewDidEnter");
  }
  //Para que los campos input sean solo letras
  public onKeyUpLetter(event: any, opt:string) {
    let newValue = event.target.value;
    let regExp = new RegExp('^[A-Za-z]+$');
    if (! regExp.test(newValue)) {
      event.target.value = newValue.slice(0, -1);
      switch (opt) {
        case "campo1":
          this.patenteCampo1 = "";
          break;
        case "campo3":
          this.patenteCampo3 = "";
          break;
        default:
          break;
      }
    }
  }
  //Para que los campos input sean solo numeros
  public onKeyUpNumber(event: any,opt:string) {
    let newValue = event.target.value;
    let regExp = new RegExp('^[0-9]+$');
    if (! regExp.test(newValue)) {
      event.target.value = newValue.slice(0, -1);
      switch (opt) {
        case "campo2":
          this.patenteCampo2 = "";
          break;
        default:
          break;
      }
    }
  }
  ionViewDidEnter(){

  }
  alta(){
    this.audioService.reproducirClick();
    this.apilarCamposPatente();
    if (!this.verificarPatente(this.vehiculo.patente)) {
      this.apilarFotos();
      let objetoJsonGenerico = JSON.parse(JSON.stringify(this.vehiculo));
      this.objFirebase.collection<vehiculo>("vehiculos").doc(this.vehiculo.patente).set(objetoJsonGenerico).then(
        Retorno=>
        {
          this.limpiarCampos();
          this.showSuccess("Vehiculo Registrado Con Exito")
        }
        ).catch( error=>{
          console.error(error);
        });
    }
    else{
      this.showError("Su Patente ya existe");
    }

  }
  baja(){
    this.audioService.reproducirClick();
    console.log("baja "+this.buscarPatente(this.patenteABuscar));
    console.log("patente buscada "+this.patenteABuscar);
    if (this.buscarPatente(this.patenteABuscar)) {
      this.coleccionTipadaFirebase.doc(this.vehiculo.patente).update({ 
        activo: '0',
        color: this.vehiculo.color,
        fotos: this.vehiculo.fotos,
        modelo: this.vehiculo.modelo,
        patente: this.vehiculo.patente
      }).then(msg => {
        this.showSuccess("Vehiculo Eliminado Correctamente");
        this.limpiarCampos();
      }).catch(error =>{
        console.error(error)
      });
    }
    else{
      this.showError("La Patente No Existe");
    }
  }
  modificacion(){
    this.audioService.reproducirClick();
    this.vehiculo.fotos = new Array();
    this.apilarFotos();
    this.coleccionTipadaFirebase.doc(this.vehiculo.patente).update({ 
      activo: '1',
      color: this.vehiculo.color,
      fotos: this.vehiculo.fotos,
      modelo: this.vehiculo.modelo,
      patente: this.vehiculo.patente
    }).then(msg => {
      this.showSuccess("Vehiculo Modificado Correctamente");
      this.limpiarCampos();
      this.abmMostrar = "Lista";
    }).catch(error =>{
      console.error(error)
    });
  }
  verificarPatente(patente){
    let aux = false;
    this.ListaDeVehiculos.forEach(vehiculo => {
      if (vehiculo.patente == patente) {
        aux = true;
      }
    });
    return aux;
  }
  buscarPatente(patente){
    console.log("BP "+patente);
    let aux = false;
    this.ListaDeVehiculos.forEach(vehi => {
      if (vehi.patente == patente) {
        this.vehiculo.color = vehi.color;
        this.vehiculo.patente = vehi.patente;
        this.vehiculo.modelo = vehi.modelo;
        for (let i = 0; i < vehi.fotos.length; i++) {
          this.vehiculo.fotos.push(vehi.fotos[i]);
        }
        this.desapilarFotos();
        this.patenteEncontrada = true;
        if (this.abmMostrar == "Lista") {
          this.abmMostrar = "Mod";
        }
        aux = true;
      }
    });
    return aux;
  }
  apilarCamposPatente(){
    this.vehiculo.patente = this.patenteCampo1 + this.patenteCampo2 + this.patenteCampo3;
  }
  apilarFotos(){
    if (this.foto1 != 'no') {
      this.vehiculo.fotos.push(this.foto1);
    }
    if (this.foto2 != 'no') {
      this.vehiculo.fotos.push(this.foto2);
    }
    if (this.foto3 != 'no') {
      this.vehiculo.fotos.push(this.foto3);
    }
  }
  desapilarFotos(){
    switch (this.vehiculo.fotos.length) {
      case 1:
        this.foto1 = this.vehiculo.fotos[0];
        break;
      case 2:
        this.foto1 = this.vehiculo.fotos[0];
        this.foto2 = this.vehiculo.fotos[1];
        break;
      case 3:
        this.foto1 = this.vehiculo.fotos[0];
        this.foto2 = this.vehiculo.fotos[1];
        this.foto3 = this.vehiculo.fotos[2];
        break;
      default:
        break;
    }
  }
  limpiarCampos(){
    this.vehiculo.patente = "";
    this.patenteCampo1 = "";
    this.patenteCampo2 = "";
    this.patenteCampo3 = "";
    this.vehiculo.color = "";
    this.vehiculo.modelo = "";
    this.vehiculo.fotos = new Array();
    this.foto1 = 'no';
    this.foto2 = 'no';
    this.foto3 = 'no';
    this.patenteEncontrada = false;
    this.patenteABuscar = "";
  }
  test(opt){
    if (opt == "Alta") {
      this.abmMostrar = opt;
      this.limpiarCampos();
    }
    else if (opt == "Mod") {
      this.abmMostrar = opt;
      this.limpiarCampos();
      
    }
    else if (opt == "Baja") {
      this.abmMostrar = opt;
      this.limpiarCampos();
      
    }
    else if (opt == "Lista") {
      this.abmMostrar = opt;
      this.limpiarCampos(); 
    }

  }
  tomarFoto(opt) {
    this.audioService.reproducirClick();
    let ruta: string = "usuarios/" + Date.now().toString();
    switch (opt) {
      case '1':
        this.servicioFotos.takePhoto(ruta).then((data) => {
          this.foto1 = data;
        }, (error) => {
          console.log('Error: ' + error);
        });
      break;
      case '2':
        this.servicioFotos.takePhoto(ruta).then((data) => {
          this.foto2 = data;
        }, (error) => {
          console.log('Error: ' + error);
        });
      break;
      case '3':
        this.servicioFotos.takePhoto(ruta).then((data) => {
          this.foto3 = data;
        }, (error) => {
          console.log('Error: ' + error);
        });
      break;
    
      default:
        break;
    }

  }
  tomarFotoLibreria(opt) {
    this.audioService.reproducirClick();
    let ruta: string = "usuarios/" + Date.now().toString();
    switch (opt) {
      case '1':
        this.servicioFotos.addLibraryPhoto(ruta).then((data) => {
          this.foto1 = data;
        }, (error) => {
          console.log('Error: ' + error);
        });
      break;
      case '2':
        this.servicioFotos.addLibraryPhoto(ruta).then((data) => {
          this.foto2 = data;
        }, (error) => {
          console.log('Error: ' + error);
        });
      break;
      case '3':
        this.servicioFotos.addLibraryPhoto(ruta).then((data) => {
          this.foto3 = data;
        }, (error) => {
          console.log('Error: ' + error);
        });
      break;
    
      default:
        break;
    }

  }
  borrarFoto(opt) {
    this.audioService.reproducirClick();
    switch (opt) {
      case '1':
        this.foto1 = 'no';
      break;
      case '2':
        this.foto2 = 'no';
      break;
      case '3':
        this.foto3 = 'no';
      break;
      default:
        break;
    }

  }
  showError(msg){
    this.audioService.reproducirError();
    const alerta = this.alertCtrl.create({
      title: 'Error!',
      subTitle: msg,
      cssClass:"miClaseDanger",
      buttons: ['Aceptar']
    });
    alerta.present();
    return;
  }
  showSuccess(msg){
    this.audioService.reproducirExito();
    const alerta = this.alertCtrl.create({
      title: 'Exito!',
      subTitle: msg,
      cssClass:"miClaseAlert",
      buttons: ['Aceptar']
    });
    alerta.present();
    return;
  }
}
