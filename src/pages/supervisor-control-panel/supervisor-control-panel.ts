import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Injectable } from '@angular/core';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { storage, firestore } from 'firebase';
import { FirebaseApp } from 'angularfire2';

import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import { TranslateService } from '@ngx-translate/core';

import { PagesModalPage } from "../pages-modal/pages-modal";
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { environment } from "../../environments/environment";
import { AbmChofer } from '../pages';
import { ContentPage } from '../content/content';
import { AbmClientesPage } from '../abm-clientes/abm-clientes';
import { NuevoViajePage } from '../nuevo-viaje/nuevo-viaje';
import { AbmSupervisoresPage } from '../abm-supervisores/abm-supervisores';
import { AbmVehiculosPage } from '../abm-vehiculos/abm-vehiculos';
import { VisorViajesPage } from '../visor-viajes/visor-viajes';
import { ListadoChoferesDisponiblesPage } from '../listado-choferes-disponibles/listado-choferes-disponibles';


@IonicPage()
@Component({
  selector: 'supervisor-control-panel',
  templateUrl: 'supervisor-control-panel.html',
})
export class SuperControlPanelPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) {

  }

  ionViewDidLoad() { //this.navCtrl.push(ContentPage); // escaner QR para test
    console.log('ionViewDidLoad Admin Control Panel Page');
  }

  irAbmChofer() {
    this.navCtrl.push(AbmChofer);
  }

  irAbmCliente() {
    this.navCtrl.push(AbmClientesPage);
  }

  irAbmSupervisor() {
    this.navCtrl.push(AbmSupervisoresPage);
  }

  irVisorViajes() {
    this.navCtrl.push(VisorViajesPage);
  }

  irAbmVehiculos(opt) {
    this.navCtrl.push(AbmVehiculosPage, { data: opt});
  }

  pedirViaje() {
    this.navCtrl.push(NuevoViajePage);
  }
  goListadoChoferes(){
    //this.navCtrl.push(ContentPage,{data:"supervisor"}); // PROBAR CEL
    this.navCtrl.push(ListadoChoferesDisponiblesPage); // PROBAR PC
  }
}
