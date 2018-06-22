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
import { ServicioFotosProvider, ServicioUsuariosProvider, ServicioViajesProvider } from '../../providers/providers';
import { Viaje } from '../../clases/viaje';
import { VisorViajesChoferPage } from '../../pages/visor-viajes-chofer/visor-viajes-chofer';

@IonicPage()
@Component({
  selector: 'chofer-panel',
  templateUrl: 'chofer-panel.html',
})
export class ChoferPanelPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private servicioViajes: ServicioViajesProvider
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Admin Control Panel Page');
  }

  irAbmChofer() {
    this.navCtrl.push(AbmChofer);
  }

  irAbmAdmin() {
    this.navCtrl.push(PagesModalPage, { titulo: 'ABM admin', data: 'No implementado...'});
  }

  irAbmCliente() {
    this.navCtrl.push(PagesModalPage, { titulo: 'ABM cliente', data: 'No implementado...'});
  }

  irAbmSupervisor() {
    this.navCtrl.push(PagesModalPage, { titulo: 'ABM supervisor', data: 'No implementado...'});
    
  }

  irVisorViajes() {
    this.navCtrl.push(ContentPage); // escaner QR
  }

  irVisorViajesParaChofer()
  {
    this.navCtrl.push(VisorViajesChoferPage);
  }



}
