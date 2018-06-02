import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { environment } from "../../environments/environment";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Usuario } from "../../clases/usuario";
import { ServicioUsuariosProvider } from '../../providers/servicio-usuarios/servicio-usuarios';

/**
 * AltaChoferPage
 *
 * Se muestra como modal, alta de nuevo chofer
 * 
 */

@IonicPage()
@Component({
  selector: 'alta-chofer-page',
  templateUrl: 'alta-chofer.html',
})
export class AltaChoferPage {
  private chofer: Usuario;
  private clave1: string;
  private clave2: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private servicioUsuarios: ServicioUsuariosProvider,
    public viewCtrl: ViewController) {
      this.chofer = new Usuario();
      this.chofer.perfil = 'chofer';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaChoferPage');

  }

  nuevoChofer() {
    // this.chofer.nombre = 'Pepe';
    // this.chofer.apellido = 'Argento';
    // this.chofer.clave = '123';
    // this.chofer.email = 'pepeargento@gmail.com';
    // this.chofer.id = 6;
    // this.chofer.fechaAlta = new Date(Date.now());
    // this.chofer.fechaNacimiento = new Date(1971, 08, 15, 17, 40, 3);
    // this.chofer.sexo = 'm';
    // this.chofer.foto;
    // this.chofer.activo = 1;
    // this.chofer.dni = 20345678;
    if (this.clave1 !== this.clave2) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    this.servicioUsuarios.guardarNuevoUsuario(this.chofer, () => {
      console.log('Chofer guardado correctamente.');
    }, (error) => {
      console.log('Error: '+ error);
    });
  }
  
  closeModal() {
    this.viewCtrl.dismiss();
  }

}
