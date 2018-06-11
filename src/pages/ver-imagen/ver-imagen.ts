import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Página modal para ver las imagenes del usuario (zoom)
 * 
 */

@IonicPage()
@Component({
  selector: 'ver-imagen',
  templateUrl: 'ver-imagen.html',
})
export class VerImagenPage {
  imagen: string; // imagen en base64

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.imagen = this.navParams.get('imagen');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerImagenPage');
  }

  cerrar() {
    this.viewCtrl.dismiss();
  }

}
