
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ServicioUsuariosProvider } from "../../providers/servicio-usuarios/servicio-usuarios";
import { ServicioAudioProvider } from "../../providers/servicio-audio/servicio-audio";
import { Usuario } from '../../clases/usuario';
import { AltaChoferPage } from '../alta-chofer/alta-chofer';
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
/**
 * página de ABM de choferes, solo lo tienen que poder usar el administrador o superusuario, y los supervisores...
 * 
 * 
 */

@IonicPage()
@Component({
  selector: 'abm-choferes',
  templateUrl: 'abm-choferes.html',
})
export class AbmChoferesPage {
  public listaChoferes: any;
  private chofer: Usuario;
  private spinner;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private servicioUsuarios: ServicioUsuariosProvider,
    public modalCtrl: ModalController,
    public audioService:ServicioAudioProvider,
    ) {
  }

  ionViewDidLoad() {
    this.spin(true);
    console.log('ionViewDidLoad AbmChoferesPage');
    let usuarios: any;
    let ob = this.servicioUsuarios.traerUsuariosPorPerfil('chofer').subscribe(data => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
      //console.log('data: ' + JSON.stringify(data));
      this.listaChoferes = data;
      this.spin(false);
      //ob.unsubscribe();
    });
  }

  refresh() {
    let ob = document.getElementById('choferes-content');
    ob.childNodes

    document.getElementById('carta').classList.add('disabled');
    document.getElementById('carta').classList.remove('disabled');
  }

  Modal(titulo: string, data: any) {
    this.modalCtrl.create(AltaChoferPage, { titulo: titulo, data: data }).present();
  }

  // esta función agrega un nuevo chofer, se activa con el botón de + en la barra de título de la interfaz
  nuevoChofer() {
    this.audioService.reproducirClick();
    console.log('agregar nuevo Chofer');
    //this.modalCtrl.create(AltaChoferPage).present();
    this.navCtrl.push(AltaChoferPage);
  }

  // para modificar los datos del chofer seleccionado, le paso al mismo modal del alta, el chofer a modificar
  modificar($event) {
    this.audioService.reproducirClick();
    console.log('Modificar chofer '+ $event.email);
    this.chofer = $event;
    //this.modalCtrl.create(AltaChoferPage, {chofer: this.chofer}).present();
    this.navCtrl.push(AltaChoferPage, {chofer: this.chofer});
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
