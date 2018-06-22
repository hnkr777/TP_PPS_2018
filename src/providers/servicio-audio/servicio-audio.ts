import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio';
/*
  Generated class for the ServicioAudioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServicioAudioProvider {

  constructor(public http: HttpClient,public nativeAudio: NativeAudio) {
    this.nativeAudio.preloadSimple('click', 'assets/mp3/click.mp3').then(()=>console.log("Todo Okey Cargando el audio"), (error) => console.info(error));
  }
  reproducirClick(){
    this.nativeAudio.play('click', () => console.log('click is done playing'));
  }
}
