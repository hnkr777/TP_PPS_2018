import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SuperControlPanelPage } from '../supervisor-control-panel/supervisor-control-panel';

/**
 * Generated class for the EncuestaSupervisorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-encuesta-supervisor',
  templateUrl: 'encuesta-supervisor.html',
})
export class EncuestaSupervisorPage {
  encuesta = {
    nombre:"",

  }
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EncuestaSupervisorPage');
  }
  aceptar(){
    this.navCtrl.setRoot(SuperControlPanelPage);
  }
  back(){
    this.navCtrl.setRoot(SuperControlPanelPage);
  }
}
