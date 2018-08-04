import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import {ServicioUsuariosProvider} from "../../providers/servicio-usuarios/servicio-usuarios";
import {ListadoViajesSelecPage} from "../listado-viajes-selec/listado-viajes-selec";
import {SuperControlPanelPage} from "../supervisor-control-panel/supervisor-control-panel";
import {ServicioAudioProvider} from "../../providers/servicio-audio/servicio-audio";
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { ThemeProvider } from '../../providers/theme/theme';
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
  private spinner;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public servicioUsuarios: ServicioUsuariosProvider,
    public audioService: ServicioAudioProvider, 
    public modalCtrl: ModalController,
    public themes: ThemeProvider
  ) {
  }

  ionViewDidLoad() {
    this.themes.refreshTheme();
    this.spin(true);
    let ob = this.servicioUsuarios.traerUsuariosPorPerfil('chofer').subscribe(data => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
      //console.log('data: ' + JSON.stringify(data));
      this.listadoChoferes = data;
      //ob.unsubscribe();
      this.spin(false);
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

  private spin(status: boolean) {
    if(this.spinner === undefined && status === true) {
      this.spinner = this.modalCtrl.create(SpinnerPage);
      this.spinner.present();
    } else if(this.spinner !== undefined && status === false) {
      this.spinner.dismiss();
      this.spinner = undefined;
    }
  }

}
