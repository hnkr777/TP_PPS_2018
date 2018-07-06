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
import { Usuario } from '../../clases/usuario';

/**
 * Página de encuesta de chofer
 * 
 *
 */
@IonicPage()
@Component({
  selector: 'encuesta-chofer',
  templateUrl: 'encuesta-chofer.html'
})
export class EncuestaChoferPage {
  options: any;
  viaje;
  private spinner;
  encuesta:Encuesta;
  usuario:Usuario

    settingsReady = false;
  
    form: FormGroup;
  
    profileSettings = {
      page: 'profile',
      pageTitleKey: 'SETTINGS_PAGE_PROFILE'
    };
  
    page: string = 'main';
    pageTitleKey: string = 'ENCUESTA_TITLE';
    pageTitle: string;
  
    subSettings: any = EncuestaChoferPage;
  
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
      public modalCtrl: ModalController,
      private servUsuarios: ServicioUsuariosProvider,
    ) {
     // this.viaje = this.navParams.get('viaje');
     // console.log(this.viaje);
     this.encuesta = new Encuesta();
    this.usuario = JSON.parse(sessionStorage.getItem("usuario"));
  
    }
  
    _buildForm() {
      let group: any = {
        option1: [this.options.option1],
        option2: [this.options.option2],
        option3: [this.options.option3],
        optRange: [this.options.optRange],
        optRadio: [this.options.optRadio]
      };
  
      switch (this.page) {
        case 'main':
          break;
        case 'profile':
          group = {
            option4: [this.options.option4]
          };
          break;
      }
      this.form = this.formBuilder.group(group);
  
      // Watch the form for changes, and
      this.form.valueChanges.subscribe((v) => {
        this.settings.merge(this.form.value);
      });
    }
  
    ionViewDidLoad() {
      // Build an empty form for the template to render
      this.form = this.formBuilder.group({});
    }
  
    ionViewWillEnter() {
      // Build an empty form for the template to render
      this.form = this.formBuilder.group({});
  
      this.page = this.navParams.get('page') || this.page;
      //this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;
  
      this.translate.get(this.pageTitleKey).subscribe((res) => {
        this.pageTitle = res;
      })
  
      this.settings.load().then(() => {
        this.settingsReady = true;
        this.options = this.settings.allSettings;
  
        this._buildForm();
      });
    }
  
    accionAceptar() {
      if(this.options.optRadio==null || this.options.optRadio==undefined )
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
      this.encuesta.respuesta=this.options.optRadio;
      this.encuesta.correoCliente=this.usuario.correo;
      this.encuesta.perfil="chofer";
      this.usuario.respondioEncuesta=true;
      this.cambiarEstadoChofer();
     /* console.log("VIAJEEE");
      this.viaje.encuestaRealizada=true;
      console.log(this.viaje);*/
      console.log("Encuesta");
      console.log(this.encuesta);
      //no va, pensar alguna manera para que el chofer cargue la encuesta 1 vez sola cada vez que arranca a trabajar
     //this.servicioViajes.modificarViaje(this.viaje);

     
    this.servicioEncuesta.guardarNuevoEncuesta(this.encuesta).then((data) => {
      this.spin(false);
      this.navCtrl.setRoot(ChoferPanelPage);  
      //this.navCtrl.popToRoot();
       let alerta = this.alertCtrl.create({
         title: "Encuesta enviada!",
         subTitle: "Usted realizó la encuesta con éxito",
         cssClass:"miClaseAlert",
       buttons: ['Aceptar']
     });
     this.audioService.reproducirExito();
      alerta.present();
    })
      .catch( error => {
        this.spin(false);
        alert("ocurrio un error");
        console.error(error);
       // this.Modal('Error', 'Detalle: '+error);
      });
     
     
     
     
     /*
      console.log(this.options.optRadio);
  
        //cambio estado a cancelado por cliente
        console.log("VIAJEEE");
      this.viaje.encuestaRealizada=true;
      console.log(this.viaje);
     // this.servicioViajes.modificarViaje(this.viaje);
     
        this.audioService.reproducirExito();
        let alerta = this.alertCtrl.create({
        title: "Encuesta enviada!",
        subTitle: "Usted realizó la encuesta con exito",
        cssClass:"miClaseAlert",
      buttons: ['Aceptar']
    });
     alerta.present();
  
     
     // this.navCtrl.setRoot(InicioClientePage);
     */
    }
  
    closeModal() {
      this.audioService.reproducirClick();
      this.navCtrl.setRoot(ChoferPanelPage);
    }

    cambiarEstadoChofer() {
      sessionStorage.setItem('usuario', JSON.stringify(this.usuario));
      this.servUsuarios.modificarUsuario(this.usuario);
    }
  
    ngOnChanges() {
      console.log('Ng All Changes');
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
