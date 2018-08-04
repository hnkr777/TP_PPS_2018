import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { CustomProvider } from '../../providers/custom/custom';
import { Camera } from '@ionic-native/camera';
import { ThemeProvider } from '../../providers/theme/theme';
import { ServicioAudioProvider } from "../../providers/servicio-audio/servicio-audio";
import { CustomConfig } from '../../clases/CustomConfig';
import { ServicioFotosProvider } from '../../providers/providers';
import { SpinnerPage } from '../pages-spinner/pages-spinner';


@Component({
  selector: 'page-custom',
  templateUrl: 'custom.html',
})
export class CustomPage {
  spinner: any;
  custom : CustomConfig;
  foto: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private custProv : CustomProvider, 
    private camera : Camera, 
    private themes : ThemeProvider, 
    private sounds : ServicioAudioProvider,
    private servicioFotos: ServicioFotosProvider,
    private modalCtrl: ModalController
  ) {
    this.custom = this.custProv.getCustomConfig();
  }

  ionViewDidLoad() {
    this.themes.refreshTheme();
  }

  testSound() {
    this.sounds.reproducirClick(); // this.custom.sound
  }

  subirFoto() {
    this.spin(true);
    this.servicioFotos.takePhoto('config/fotoBG.jpg').then((rutaFoto) => {
      this.custom.foto = rutaFoto;
      console.warn('Return ruta foto: '+rutaFoto);
      this.spin(false);
    });
  }

  _subirFoto() {
    this.camera.getPicture({
      quality: 10,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }).then(img => {
      let foto = "data:image/jpeg;base64," + img;
      sessionStorage.setItem('foto', foto);
    }).catch(err => {
      console.log("ERROR AL SACAR FOTO !!!");
    })
  }

  guardar() {
    this.custProv.saveCustom(this.custom);
  }

  borrarFoto() {
    this.custom.foto = undefined;
    this.guardar();
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
