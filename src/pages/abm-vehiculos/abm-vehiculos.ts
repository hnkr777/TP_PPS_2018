import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AbmVehiculosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-abm-vehiculos',
  templateUrl: 'abm-vehiculos.html',
})
export class AbmVehiculosPage {
  abmMostrar  = "";
  public vehiculo = {
    patente: "",
    modelo: "",
    color: "",
    fotos: "",
    //qr: "",
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.abmMostrar = this.navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AbmVehiculosPage');
  }
  alta(){

  }
  baja(){

  }
  modificacion(){
    
  }
  test(opt){
    if (opt == "Alta") {
      this.abmMostrar = opt;
    }
    else if (opt == "Mod") {
      this.abmMostrar = opt;
    }
    else if (opt == "Baja") {
      this.abmMostrar = opt;
    }

  }

}
