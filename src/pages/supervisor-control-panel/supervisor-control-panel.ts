import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
/*import { TabsPage } from '../tabs/tabs';
import { Injectable } from '@angular/core';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { storage, firestore } from 'firebase';
import { FirebaseApp } from 'angularfire2';

import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import { TranslateService } from '@ngx-translate/core';*/

import { PagesModalPage } from "../pages-modal/pages-modal";
//import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
//import { environment } from "../../environments/environment";
import { AbmChofer } from '../pages';
import { ContentPage } from '../content/content';
import { AbmClientesPage } from '../abm-clientes/abm-clientes';
import { NuevoViajePage } from '../nuevo-viaje/nuevo-viaje';
import { AbmSupervisoresPage } from '../abm-supervisores/abm-supervisores';
import { AbmVehiculosPage } from '../abm-vehiculos/abm-vehiculos';
import { VisorViajesPage } from '../visor-viajes/visor-viajes';
import { LoginPage } from '../login/login';
//import { ListadoChoferesDisponiblesPage } from '../listado-choferes-disponibles/listado-choferes-disponibles';
import {ServicioAudioProvider} from '../../providers/servicio-audio/servicio-audio'
import { EncuestaSupervisorPage } from '../encuesta-supervisor/encuesta-supervisor';
import { MyApp } from '../../app/app.component';


@IonicPage()
@Component({
  selector: 'supervisor-control-panel',
  templateUrl: 'supervisor-control-panel.html',
})
export class SuperControlPanelPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public audioService: ServicioAudioProvider
  ) {

  }

  ionViewDidLoad() { //this.navCtrl.push(ContentPage); // escaner QR para test
    console.log('ionViewDidLoad Admin Control Panel Page');
  }

  muteAudio(){
    this.audioService.mute = !this.audioService.mute;
    console.log(this.audioService.mute);
  }

  irAbmChofer() {
    this.audioService.reproducirClick();
    this.navCtrl.push(AbmChofer);
  }

  irAbmCliente() {
    this.audioService.reproducirClick();
    this.navCtrl.push(AbmClientesPage);
  }

  irAbmSupervisor() {
    this.audioService.reproducirClick();
    this.navCtrl.push(AbmSupervisoresPage);
  }

  irVisorViajes() {
    this.audioService.reproducirClick();
    this.navCtrl.push(VisorViajesPage);
  }

  irAbmVehiculos(opt) {
    this.audioService.reproducirClick();
    this.navCtrl.push(AbmVehiculosPage, { data: opt});
  }

  pedirViaje() {
    this.audioService.reproducirClick();
    this.navCtrl.push(NuevoViajePage);
  }
  goListadoChoferes(){
    this.audioService.reproducirClick();
    this.navCtrl.push(ContentPage,{data:"supervisorLC"}); // PROBAR CEL
    //this.navCtrl.push(ListadoChoferesDisponiblesPage); // PROBAR PC
  }
  goEncuesta(){
    this.audioService.reproducirClick();
    this.navCtrl.push(ContentPage,{data:"supervisorEC"});
    //this.navCtrl.push(EncuestaSupervisorPage); // PROBAR PC
    //this.navCtrl.push(EncuestaChoferPage); // PROBAR PC
  }
  goEstadisticas(){
    this.audioService.reproducirClick();
    //this.modalCtrl.create(PagesModalPage,{titulo:"Estadísticas",data:""}).present()
    this.navCtrl.push(PagesModalPage, { titulo: "Estadísticas", data: "" });
  }

  logout(){
    this.audioService.reproducirClick();
    sessionStorage.clear();
    localStorage.removeItem('usuario');
    this.navCtrl.setRoot(MyApp);
  }
}
