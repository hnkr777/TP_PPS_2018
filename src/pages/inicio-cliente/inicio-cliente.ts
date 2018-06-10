import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the InicioClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inicio-cliente',
  templateUrl: 'inicio-cliente.html',
})
export class InicioClientePage {
usuarioDatos;
nombre;
foto;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioClientePage');
    this.usuarioDatos = JSON.parse(sessionStorage.getItem('usuario'));
    this.nombre=this.usuarioDatos.nombre;
    this.foto=this.usuarioDatos.foto;
  }

}
