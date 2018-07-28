import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Audio } from '../../clases/audio';

/*
  Generated class for the ServicioAudioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on provider
  and Angular DI.
*/


@Injectable()
export class ServicioAudioProvider {
  /**
   * Variable que decidira si reproduce sonido (true) o no (false)
   */
  mute:boolean;
  /**
     * @ignore
     */
  constructor(public http: HttpClient,public nativeAudio: NativeAudio,private objFirebase: AngularFirestore) {
    this.nativeAudio.preloadSimple('click', 'assets/mp3/click.mp3').then(()=>console.log("Todo Okey Cargando el audio"), (error) => console.info(error));
    this.nativeAudio.preloadSimple('inicio', 'assets/mp3/inicio.mp3').then(()=>console.log("Todo Okey Cargando el audio"), (error) => console.info(error));
    this.nativeAudio.preloadSimple('correct', 'assets/mp3/correct.mp3').then(()=>console.log("Todo Okey Cargando el audio"), (error) => console.info(error));
    this.nativeAudio.preloadSimple('error', 'assets/mp3/error.mp3').then(()=>console.log("Todo Okey Cargando el audio"), (error) => console.info(error));
    //this.verificarMute();
  }
  /**
  * Reproduce un sonido de Click mientras que el mute no este activo
  * 
  * @example
  * Simplemente hay que llamar la funcion y reproducira el sonido:
  * reproducirClick();
  */
  /**
   * @api Reproducir sonido de Click
   * @apiName reproducirClick
   * @apiGroup Sonidos
   * @apiDescription Reproduce un sonido de click en la app
   */
  reproducirClick(){
    if (this.mute) {
      this.nativeAudio.play('click', () => console.log('click is done playing'));
    }
  }
  /**
  * Reproduce un sonido de Inicio mientras que el mute no este activo
  * 
  * @example
  * Simplemente hay que llamar la funcion y reproducira el sonido:
  * reproducirInicio();
  */

  /**
   * @api Reproducir sonido de Inicio
   * @apiName reproducirInicio
   * @apiGroup Sonidos
   * @apiDescription Reproduce un sonido de Inicio en la app
   */
  reproducirInicio(){
    if (this.mute) {
      this.nativeAudio.play('inicio', () => console.log('inicio is done playing'));
    }
  }

  /**
    * Reproduce un sonido de Error mientras que el mute no este activo
    * 
    * @example
    * Simplemente hay que llamar la funcion y reproducira el sonido:
    * reproducirError();
    */

  /**
   * @api Reproducir sonido de Error
   * @apiName reproducirError
   * @apiGroup Sonidos
   * @apiDescription Reproduce un sonido de Error en la app
   */
  reproducirError(){
    if (this.mute) {
      this.nativeAudio.play('error', () => console.log('error is done playing'));
    }
  }


  /**
  * Reproduce un sonido de exito mientras que el mute no este activo
  * 
  * @example
  * Simplemente hay que llamar la funcion y reproducira el sonido:
  * reproducirExito();
  */

  /**
   * @api Reproducir sonido de Exito
   * @apiName reproducirExito
   * @apiGroup Sonidos
   * @apiDescription Reproduce un sonido de Exito en la app
   */
  reproducirExito(){
    if (this.mute) {
      this.nativeAudio.play('correct', () => console.log('correct is done playing'));
    }
  }
}
