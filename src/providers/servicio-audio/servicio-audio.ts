
import { Injectable } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio';
import { Observable } from 'rxjs/Observable';
import { Audio } from '../../clases/audio';

/*
  Generated class for the ServicioAudioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServicioAudioProvider {
  
  mute: boolean = true;

  constructor(public nativeAudio: NativeAudio) {
    this.nativeAudio.preloadSimple('click', 'assets/mp3/click.mp3').then(()=>console.log("Todo Ok Cargando el audio"), (error) => console.info(error));
    this.nativeAudio.preloadSimple('inicio', 'assets/mp3/inicio.mp3').then(()=>console.log("Todo Ok Cargando el audio"), (error) => console.info(error));
    this.nativeAudio.preloadSimple('correct', 'assets/mp3/correct.mp3').then(()=>console.log("Todo Ok Cargando el audio"), (error) => console.info(error));
    this.nativeAudio.preloadSimple('error', 'assets/mp3/error.mp3').then(()=>console.log("Todo Ok Cargando el audio"), (error) => console.info(error));
    
    this.nativeAudio.preloadSimple('glitch', 'assets/mp3/Glitch-button-noise.mp3').then(()=>console.log("Todo Ok Cargando el audio"), (error) => console.info(error));
    this.nativeAudio.preloadSimple('beep', 'assets/mp3/Button-beep-tone.mp3').then(()=>console.log("Todo Ok Cargando el audio"), (error) => console.info(error));
    this.nativeAudio.preloadSimple('noise', 'assets/mp3/Short-beep-noise.mp3').then(()=>console.log("Todo Ok Cargando el audio"), (error) => console.info(error));
    //this.verificarMute();
  }

  reproducirClick() {
    if (true) {
      this.nativeAudio.play('click', () => console.log('click is done playing'));
    }
  }

  reproducirInicio() {
    if (true) {
      this.nativeAudio.play('inicio', () => console.log('inicio is done playing'));
    }
  }

  reproducirError() {
    if (true) {
      this.nativeAudio.play('error', () => console.log('error is done playing'));
    }
  }

  reproducirExito() {
    if (true) {
      this.nativeAudio.play('correct', () => console.log('correct is done playing'));
    }
  }

  reproducirBeep() {
    if (true) {
      this.nativeAudio.play('beep', () => console.log('beep is done playing'));
    }
  }

  reproducirGlitch() {
    if (true) {
      this.nativeAudio.play('glitch', () => console.log('glitch is done playing'));
    }
  }

  reproducirNoise() {
    if (true) {
      this.nativeAudio.play('noise', () => console.log('noise is done playing'));
    }
  }

  /*verificarMute(){
    let coleccionTipadaFirebase= this.objFirebase.collection<Audio>('Audio'); 
    //para el filtrado mirar la documentación https://firebase.google.com/docs/firestore/query-data/queries?authuser=0
    let ListadoDeChatsObservable= coleccionTipadaFirebase.valueChanges();
    ListadoDeChatsObservable.subscribe(x => {
        console.info("conexión correcta con Firebase",x);
        this.mute = x[0].mute; 
    })
     console.log("fin de ionViewDidEnter");
  }*/
}
