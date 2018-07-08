import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ViewController,AlertController,ModalController } from 'ionic-angular';

import { Settings } from '../../providers/providers';
import { ChoferPanelPage } from '../chofer-panel/chofer-panel';
import { InicioClientePage } from '../inicio-cliente/inicio-cliente';
import { ServicioFotosProvider, ServicioUsuariosProvider, ServicioViajesProvider } from '../../providers/providers';
import { ServicioAudioProvider } from '../../providers/servicio-audio/servicio-audio';
import { ServicioEncuestasProvider } from '../../providers/servicio-encuestas/servicio-encuestas';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { storage, firestore } from 'firebase';
import * as firebase from 'firebase';
import { LoginPage } from "../../pages/login/login";
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { Encuesta } from '../../clases/encuesta';
import { SuperControlPanelPage } from '../supervisor-control-panel/supervisor-control-panel';
import { SupervisorPanelPage } from '../supervisor-panel/supervisor-panel';


/**
 * Generated class for the EncuestaSupervisorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-encuesta-supervisor',
  templateUrl: 'encuesta-supervisor.html',
})
export class EncuestaSupervisorPage {
  respuesta:string;
  encuesta:Encuesta;
  private spinner;
  constructor(public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    private viewCtrl: ViewController,
    private servicioViajes: ServicioViajesProvider,
    public alertCtrl: AlertController,
    public audioService:ServicioAudioProvider,
    private servicioEncuesta: ServicioEncuestasProvider,
    private objFirebase: AngularFirestore,
    public modalCtrl: ModalController) {
      this.encuesta = new Encuesta();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EncuestaSupervisorPage');
  }
  aceptar(){
    this.navCtrl.setRoot(SuperControlPanelPage);
  }
  back(){
    this.navCtrl.setRoot(SuperControlPanelPage);
  }
  accionAceptar() {
    if(this.respuesta==null || this.respuesta==undefined )
    {
      let alerta = this.alertCtrl.create({
        title: "Error!",
        subTitle: "Seleccione una opción",
        cssClass:"miClaseDanger",
        buttons: ['Aceptar']
      });
      this.audioService.reproducirError();
      alerta.present();
      return;
    }
    this.spin(true);
    this.encuesta.fechaRegistroString=null;
    this.encuesta.respuesta=this.respuesta;
    this.encuesta.correoCliente=null;
    this.encuesta.perfil="supervisor";
    /*console.log("VIAJEEE");
    this.viaje.encuestaRealizada=true;
    console.log(this.viaje);*/
    console.log("Encuesta");
    console.log(this.encuesta);
    //descomentar esto
    //this.servicioViajes.modificarViaje(this.viaje);
    this.servicioEncuesta.guardarNuevoEncuesta(this.encuesta).then((data) => {
      this.spin(false);
      this.navCtrl.setRoot(SuperControlPanelPage);  
      //this.navCtrl.popToRoot();
      let alerta = this.alertCtrl.create({
        title: "Encuesta enviada!",
        subTitle: "Usted realizó la encuesta con éxito",
        cssClass:"miClaseAlert",
        buttons: ['Aceptar']
      });
      this.audioService.reproducirExito();
      alerta.present();
    }).catch( error => {
        this.spin(false);
        let alerta = this.alertCtrl.create({
          title: "Error!",
          subTitle: "Ha ocurrido un error interno de Firebase",
          cssClass:"miClaseDanger",
        buttons: ['Aceptar']
      });
       alerta.present();
        console.error(error);
      });
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
