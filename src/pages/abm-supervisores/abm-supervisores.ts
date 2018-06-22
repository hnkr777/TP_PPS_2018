
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ServicioUsuariosProvider } from "../../providers/servicio-usuarios/servicio-usuarios";
import { Usuario } from '../../clases/usuario';
import { AltaSupervisorPage } from '../alta-supervisor/alta-supervisor';

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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private servicioUsuarios: ServicioUsuariosProvider,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AbmSupervisoresPage');
    let usuarios: any;
    let ob = this.servicioUsuarios.traerUsuariosPorPerfil('supervisor').subscribe(data => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
      //console.log('data: ' + JSON.stringify(data));
      this.listaSupervisores = data;
      //ob.unsubscribe();
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
    console.log('agregar nuevo supervisor');
    this.modalCtrl.create(AltaSupervisorPage).present();
    
  }

  // para modificar los datos del supervisor seleccionado, le paso al mismo modal del alta, el supervisor a modificar
  modificar($event) {
    console.log('Modificar supervisor '+ $event.email);
    this.supervisor = $event;
    this.modalCtrl.create(AltaSupervisorPage, {supervisor: this.supervisor}).present();
  }
  
}
