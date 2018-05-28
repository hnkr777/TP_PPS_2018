
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ServicioUsuariosProvider } from "../../providers/servicio-usuarios/servicio-usuarios";
import { Usuario } from '../../clases/usuario';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private servicioUsuarios: ServicioUsuariosProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AbmChoferesPage');
    let usuarios: any;
    let ob = this.servicioUsuarios.traerUsuariosPorPerfil('chofer').subscribe(data => {
      //console.log('data: ' + JSON.stringify(data));
      this.listaChoferes = data;
      ob.unsubscribe();
    });
  }

  // esta función agrega un nuevo chofer, se activa con el botón de + en la barra de título de la interfaz
  nuevoChofer() {
    console.log('agregar nuevo Chofer');
    let usuario: Usuario = new Usuario();
    usuario.nombre = 'Pepe';
    usuario.apellido = 'Argento';
    usuario.clave = '123';
    usuario.email = 'pepeargento@gmail.com';
    usuario.id = 6;
    usuario.fechaAlta = new Date(Date.now());
    usuario.fechaNacimiento = new Date('14/05/1971');
    usuario.perfil = 'chofer';
    usuario.sexo = 'm';

    this.servicioUsuarios.guardarNuevoUsuario(usuario, () => {
      console.log('Usuario guardado correctamente.');
    }, (error) => {
      console.log('Error: '+ error);
    });
  }

}
