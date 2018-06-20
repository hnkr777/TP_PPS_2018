import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,AlertController } from 'ionic-angular';
import {ServicioViajesProvider} from '../../providers/servicio-viajes/servicio-viajes';
import {ServicioUsuariosProvider} from '../../providers/servicio-usuarios/servicio-usuarios';
import {Viaje} from '../../clases/viaje';
import {Usuario} from '../../clases/usuario';
import { Observable } from 'rxjs/Observable';
import {VerViajePage} from '../ver-viaje/ver-viaje'
/**
 * Generated class for the ListadoViajesSelecPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listado-viajes-selec',
  templateUrl: 'listado-viajes-selec.html',
})
export class ListadoViajesSelecPage {
  //listadoViajes:any;
  listadoViajesFiltrado:any;
  correoChofer:string;
  chofer:Usuario;
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,public servicioViajes:ServicioViajesProvider,public servicioUsuarios:ServicioUsuariosProvider,public modalCtrl:ModalController) {
    this.chofer = this.navParams.get('data');
    this.correoChofer = this.chofer.correo;
    //this.listadoViajes = servicioViajes.traerViajes();
    this.listadoViajesFiltrado = new Array<Viaje[]>();
    this.filtrar();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListadoViajesSelecPage');
  }
  filtrar(){
      console.log(Date());
      let ob = this.servicioViajes.traerViajesFiltrados('correoChofer', '==', '' ).subscribe(data => {
        console.log('Cantidad viajes: ' + data.length);
  
        this.listadoViajesFiltrado = data;
  
        ob.unsubscribe();
        
      });
    }
  asignarViaje(viaje:Viaje){
    viaje.correoChofer = this.correoChofer;
    //viaje.id = viaje.fechaRegistro;
    //viaje.id = 1529533431;
    this.chofer.estado = 1;
    console.log("VIAJE!: ");
    console.info(viaje);
    this.servicioUsuarios.modificarUsuario(this.chofer);
    this.servicioViajes.modificarViaje(viaje);
    this.showSuccess("Viaje Asignado al chofer: "+this.chofer.nombre+" "+this.chofer.apellido);
    this.navCtrl.popToRoot();
  }
  showError(msg){
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
