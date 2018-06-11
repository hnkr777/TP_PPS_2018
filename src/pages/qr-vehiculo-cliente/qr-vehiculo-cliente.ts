import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { AbmClienteProvider } from "../../providers/abm-cliente/abm-cliente";
import { InicioClientePage } from '../../pages/inicio-cliente/inicio-cliente';
/**
 * Generated class for the QrVehiculoClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr-vehiculo-cliente',
  templateUrl: 'qr-vehiculo-cliente.html',
})
export class QrVehiculoClientePage {

chofer:any;


  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl :ViewController , private servicioCliente: AbmClienteProvider) {
    this.chofer = navParams.get('chofer');
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrVehiculoClientePage');
  }

  close() {
    this.navCtrl.setRoot(InicioClientePage)
  }

}
