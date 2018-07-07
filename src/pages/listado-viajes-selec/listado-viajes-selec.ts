import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,AlertController } from 'ionic-angular';
import {ServicioViajesProvider} from '../../providers/servicio-viajes/servicio-viajes';
import {ServicioUsuariosProvider} from '../../providers/servicio-usuarios/servicio-usuarios';
import {Viaje} from '../../clases/viaje';
import {Usuario} from '../../clases/usuario';
import { Observable } from 'rxjs/Observable';
import {VerViajePage} from '../ver-viaje/ver-viaje';
import {ServicioAudioProvider} from '../../providers/servicio-audio/servicio-audio';
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
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
  listadoViajesFiltrado:Array<Viaje>;
  correoChofer:string;
  chofer:Usuario;
  private spinner;
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,public servicioViajes:ServicioViajesProvider,public audioService:ServicioAudioProvider,public servicioUsuarios:ServicioUsuariosProvider,public modalCtrl:ModalController) {
    this.chofer = this.navParams.get('data');
    this.correoChofer = this.chofer.correo;
    //this.listadoViajes = servicioViajes.traerViajes();
    this.listadoViajesFiltrado = new Array<Viaje>();
    this.filtrar();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListadoViajesSelecPage');
  }
  filtrar(){
    this.spin(true);
      console.log(Date());
      let ob = this.servicioViajes.traerViajesFiltrados('correoChofer', '==', '' ).subscribe(data => {
        console.log('Cantidad viajes: ' + data.length);
        data.forEach(element => {
          if (element.estado == 0) {
            this.listadoViajesFiltrado.push(element);            
          }
        });
        ob.unsubscribe();
        this.spin(false);
      });
    }
  asignarViaje(viaje:Viaje){
    this.audioService.reproducirClick();
    viaje.correoChofer = this.correoChofer;
    //viaje.id = viaje.fechaRegistro;
    //viaje.id = 1529533431;
    //viaje.estado = 1;
    //this.chofer.estado = 2;
    console.log("VIAJE!: ");
    console.info(viaje);
    //this.servicioUsuarios.modificarUsuario(this.chofer);
    this.servicioViajes.modificarViaje(viaje);
    this.showSuccess("Viaje Asignado al chofer: "+this.chofer.nombre+" "+this.chofer.apellido);
    this.navCtrl.popToRoot();
  }
  back(){
    this.navCtrl.popToRoot();
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

  private spin(status: boolean) {
    if(this.spinner === undefined && status === true) {
      this.spinner = this.modalCtrl.create(SpinnerPage);
      this.spinner.present();
    } else if(this.spinner !== undefined && status === false) {
      this.spinner.dismiss();
      this.spinner = undefined;
    }
  }
}
