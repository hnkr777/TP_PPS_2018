
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ServicioUsuariosProvider } from "../../providers/servicio-usuarios/servicio-usuarios";
import { ServicioAudioProvider } from "../../providers/servicio-audio/servicio-audio";
import { Usuario } from '../../clases/usuario';
import { AltaSupervisorPage } from '../alta-supervisor/alta-supervisor';
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { InAppBrowser } from '../../../node_modules/@ionic-native/in-app-browser';
import { MostrarImgPage } from '../mostrar-img/mostrar-img';
/**
 * página de ABM de supervisores, solo lo tiene que poder usar el administrador o superusuario, y los supervisores...
 * 
 * 
 */

@IonicPage()
@Component({
  selector: 'abm-supervisores',
  templateUrl: 'abm-supervisores.html',
})
export class AbmSupervisoresPage {
  public listaSupervisores: any;
  private supervisor: Usuario;
  private spinner;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private servicioUsuarios: ServicioUsuariosProvider,
    public modalCtrl: ModalController,
    public audioService:ServicioAudioProvider,
    public inab:InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AbmSupervisoresPage');
    let usuarios: any;
    this.spin(true);
    let ob = this.servicioUsuarios.traerUsuariosPorPerfil('supervisor').subscribe(data => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
      //console.log('data: ' + JSON.stringify(data));
      this.listaSupervisores = data;
      //ob.unsubscribe();
      this.spin(false);
    });
  }

  refresh() {
    let ob = document.getElementById('supervisores-content');
    ob.childNodes

    document.getElementById('carta').classList.add('disabled');
    document.getElementById('carta').classList.remove('disabled');
  }

  Modal(titulo: string, data: any) {
    this.modalCtrl.create(AltaSupervisorPage, { titulo: titulo, data: data }).present();
  }

  // esta función agrega un nuevo supervisor, se activa con el botón de + en la barra de título de la interfaz
  nuevoSupervisor() {
    this.audioService.reproducirClick();
    console.log('agregar nuevo supervisor');
    this.modalCtrl.create(AltaSupervisorPage).present();
    
  }

  // para modificar los datos del supervisor seleccionado, le paso al mismo modal del alta, el supervisor a modificar
  modificar($event) {
    this.audioService.reproducirClick();
    console.log('Modificar supervisor '+ $event.email);
    this.supervisor = $event;
    this.modalCtrl.create(AltaSupervisorPage, {supervisor: this.supervisor}).present();
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
  goLinkApidoc(){
    this.inab.create("http://juanmurciautn.hol.es/DocApiDoc/");
  }
  goLinkCompoDoc(){
    this.inab.create("http://juanmurciautn.hol.es/DocCompoDoc/");
  }
  goMostrar(){
    this.navCtrl.push(MostrarImgPage,{img:"TutoABMSupervisores",gif:false});
  }
}
