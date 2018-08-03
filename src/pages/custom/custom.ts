import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CustomProvider } from '../../providers/custom/custom';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ThemeProvider } from '../../providers/theme/theme';
import { ServicioAudioProvider } from "../../providers/servicio-audio/servicio-audio";
import { CustomConfig } from '../../clases/CustomConfig';


@Component({
  selector: 'page-custom',
  templateUrl: 'custom.html',
})
export class CustomPage {

  custom : CustomConfig;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private custProv : CustomProvider, 
    private camera : Camera, 
    private themes : ThemeProvider, 
    private sounds : ServicioAudioProvider
  ) {
    this.custom = this.custProv.getCustomConfig();
  }

  ionViewDidLoad() {
    this.themes.refreshTheme();
  }

  testSound() {
    this.sounds.reproducirBeep(); // this.custom.sound
  }

  subirFoto() {
    this.camera.getPicture({
      quality: 10,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }).then(img => {
      this.custom.foto = "data:image/jpeg;base64," + img;
    }).catch(err => {
      console.log("ERROR AL SACAR FOTO");
      console.log("[ERROR->>>]" + JSON.stringify(err));
    })
  }

  guardar() {
    this.custProv.saveCustom(this.custom);
  }
}
