import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ServicioUsuariosProvider} from "../../providers/servicio-usuarios/servicio-usuarios";
import {ListadoViajesSelecPage} from "../listado-viajes-selec/listado-viajes-selec";
import {SuperControlPanelPage} from "../supervisor-control-panel/supervisor-control-panel";
import {ServicioAudioProvider} from "../../providers/servicio-audio/servicio-audio";
import { InAppBrowser } from '../../../node_modules/@ionic-native/in-app-browser';
import { MostrarImgPage } from '../mostrar-img/mostrar-img';

/**
 * Generated class for the ListadoChoferesDisponiblesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listado-choferes-disponibles',
  templateUrl: 'listado-choferes-disponibles.html',
})
export class ListadoChoferesDisponiblesPage {
  public listadoChoferes;
  constructor(public inab:InAppBrowser, public navCtrl: NavController, public navParams: NavParams,public servicioUsuarios:ServicioUsuariosProvider,public audioService:ServicioAudioProvider) {
  }

  ionViewDidLoad() {
    let ob = this.servicioUsuarios.traerUsuariosPorPerfil('chofer').subscribe(data => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
      //console.log('data: ' + JSON.stringify(data));
      this.listadoChoferes = data;
      //ob.unsubscribe();
    });
  }
  mostrarListado(){
    console.info(this.listadoChoferes);
  }
  asignarViaje(chofer:any){
    this.audioService.reproducirClick();
    this.navCtrl.push(ListadoViajesSelecPage,{data: chofer})
  }
  back(){
    this.audioService.reproducirClick();
    this.navCtrl.setRoot(SuperControlPanelPage);
  }
  goLinkApidoc(){
    this.inab.create("http://juanmurciautn.hol.es/DocApiDoc/");
  }
  goLinkCompoDoc(){
    this.inab.create("http://juanmurciautn.hol.es/DocCompoDoc/");
  }
  goMostrar(){
    this.navCtrl.push(MostrarImgPage,{img:"TutoChoferesDisponibles",gif:false});      
  }
}
