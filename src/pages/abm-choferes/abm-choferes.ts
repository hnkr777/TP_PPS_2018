
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ServicioUsuariosProvider } from "../../providers/servicio-usuarios/servicio-usuarios";
import { Usuario } from '../../clases/usuario';
import { AltaChoferPage } from '../alta-chofer/alta-chofer';

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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private servicioUsuarios: ServicioUsuariosProvider,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AbmChoferesPage');
    let usuarios: any;
    let ob = this.servicioUsuarios.traerUsuariosPorPerfil('chofer').subscribe(data => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
      //console.log('data: ' + JSON.stringify(data));
      this.listaChoferes = data;
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
    console.log('agregar nuevo Chofer');
    this.modalCtrl.create(AltaChoferPage).present();
    
  }

  // para modificar los datos del chofer seleccionado, le paso al mismo modal del alta, el chofer a modificar
  modificar($event) {
    console.log('Modificar chofer'+ JSON.stringify($event));
    this.chofer = $event;
    this.modalCtrl.create(AltaChoferPage, {chofer: this.chofer}).present();
  }
  
}
