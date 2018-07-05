import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ViewController,AlertController } from 'ionic-angular';

import { Settings } from '../../providers/providers';
import { ChoferPanelPage } from '../chofer-panel/chofer-panel';
import { InicioClientePage } from '../inicio-cliente/inicio-cliente';
import { ServicioFotosProvider, ServicioUsuariosProvider, ServicioViajesProvider } from '../../providers/providers';
import { ServicioAudioProvider } from '../../providers/servicio-audio/servicio-audio';
/**
 * Generated class for the EncuestaClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-encuesta-cliente',
  templateUrl: 'encuesta-cliente.html',
})
export class EncuestaClientePage {
  options: any;
  viaje;
    settingsReady = false;
  
    form: FormGroup;
  
    profileSettings = {
      page: 'profile',
      pageTitleKey: 'SETTINGS_PAGE_PROFILE'
    };
  
    page: string = 'main';
    pageTitleKey: string = 'ENCUESTA_TITLE';
    pageTitle: string;
  
    subSettings: any = EncuestaClientePage;
  
    constructor(public navCtrl: NavController,
      public settings: Settings,
      public formBuilder: FormBuilder,
      public navParams: NavParams,
      public translate: TranslateService,
      private viewCtrl: ViewController,
      private servicioViajes: ServicioViajesProvider,
      public alertCtrl: AlertController,
      public audioService:ServicioAudioProvider
    ) {
      this.viaje = this.navParams.get('viaje');
      console.log(this.viaje);
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
 
  
        //cambio estado a cancelado por cliente
        console.log("VIAJEEE");
      this.viaje.encuestaRealizada=true;
      console.log(this.viaje);
      this.servicioViajes.modificarViaje(this.viaje);
     
        this.audioService.reproducirExito();
        let alerta = this.alertCtrl.create({
        title: "Encuesta enviada!",
        subTitle: "Usted realizó la encuesta con exito",
        cssClass:"miClaseAlert",
      buttons: ['Aceptar']
    });
     alerta.present();
  
     
      this.navCtrl.setRoot(InicioClientePage);
    }
  
    closeModal() {
      this.navCtrl.setRoot(InicioClientePage);
    }
  
    ngOnChanges() {
      console.log('Ng All Changes');
    }

}