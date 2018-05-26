import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { MainPage } from '../pages';
import { ContentPage } from "../content/content";

@IonicPage()
@Component({
  selector: 'page-pages-modal-votacion',
  templateUrl: 'pages-modal-votacion.html',
})
export class PagesModalVotacionPage {
  cuerpo: string = "";
  titulo: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController) {
    //this.cuerpo = navParams.get('data');
    //this.titulo = navParams.get('titulo');
  }

  public votar(opcion: number) {
    this.closeModal();
    this.navCtrl.push(MainPage, {opcion: opcion});
  }

  ionViewDidLoad() {

  }

  closeModal() {
    
    this.viewCtrl.dismiss();
  }
}
