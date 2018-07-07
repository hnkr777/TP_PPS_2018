import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirstRunPage, MainPage } from "../pages";
import {ServicioAudioProvider } from "../../providers/servicio-audio/servicio-audio"
import { NativeAudio } from '@ionic-native/native-audio';
/**
 * Splash animado
 *
 * 
 */

@IonicPage()
@Component({
  selector: 'animated-splash',
  templateUrl: 'animated-splash.html',
})
export class AnimatedSplashPage {

  splash: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public audioService:ServicioAudioProvider,public nativeAudio: NativeAudio) {
  }

  ionViewDidLoad() {
    //this.audioService.reproducirInicio();
      
      this.nativeAudio.preloadSimple('inicio', 'assets/mp3/inicio.mp3').then(()=>{
        console.log("Todo Okey Cargando el audio");
        this.nativeAudio.play('inicio', () => {
          console.log('inicio is done playing');
          this.nativeAudio.unload('inicio');
        });
      }, (error) => console.info(error));
    setTimeout(() => {
      this.splash = false;
      this.navCtrl.setRoot(FirstRunPage);
    }, 4000); // este es el tiempo del splashscreen, default 4000
  }

}
