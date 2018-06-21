import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { environment } from "../../environments/environment";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Usuario } from "../../clases/usuario";
import { ServicioUsuariosProvider } from '../../providers/servicio-usuarios/servicio-usuarios';
import { ServicioFotosProvider } from '../../providers/servicio-fotos/servicio-fotos';
import { TranslateService } from '@ngx-translate/core';
import { VerImagenPage } from '../ver-imagen/ver-imagen';

/**
 * AltaChoferPage
 *
 * Se muestra como modal, alta de nuevo chofer
 * O se puede editar un chofer existente, pasándole el chofer por navParams
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
  private validos: boolean;
  private modoAlta: boolean;
  private habilitado: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private servicioUsuarios: ServicioUsuariosProvider,
    private servicioFotos: ServicioFotosProvider,
    public viewCtrl: ViewController,
    public translateService: TranslateService,
    public alertCtrl: AlertController
  ) {
      let chofer = navParams.get('chofer');
      
      if(chofer !== undefined) { // entramos en modo modificación
        this.modoAlta = false;
        this.chofer = chofer;
        this.habilitado = chofer.activo == 1;
        this.clave1 = chofer.clave;
        this.clave2 = chofer.clave;
        console.log('AltaChoferPage: modificando chofer ' + this.chofer.correo);
      } else { // sino, en modo alta nuevo chofer
        this.modoAlta = true;
        this.habilitado = true;
        this.chofer = new Usuario('chofer');
        this.chofer.foto = undefined;
        console.log('AltaChoferPage: nuevo chofer');
      }

      this.validos = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaChoferPage');
    
  }

  verImagen() {
    if (this.chofer.foto !== undefined) {
      this.modalCtrl.create(VerImagenPage, { imagen: this.chofer.foto}).present();
    } else {
      this.Msg('Aviso', 'Sin foto');
    }
  }

  accionAceptar() {
    if (!this.validar()) {
      return;
    }

    if(this.modoAlta) {
      this.nuevoChofer();
    } else {
      this.modificarChofer();
    }
  }

  modificarChofer() {
    this.servicioUsuarios.modificarUsuario(this.chofer);
    this.closeModal();
  }

  nuevoChofer() {
    this.servicioUsuarios.guardarNuevoUsuario(this.chofer).then(data => {
      this.closeModal();
      console.log('Chofer guardado correctamente.');
      this.Msg('Aviso', 'Chofer guardado correctamente.');
    }).catch((error) => {
      console.log('Error: '+ error);
      this.errorMsg('Error', 'Error: '+ error);
    });
  }

  tomarFoto() {
    let ruta: string = "usuarios/" + Date.now().toString();
    this.servicioFotos.takePhoto(ruta).then((data) => {
      this.chofer.foto = data;
    }, (error) => {
      console.log('Error: ' + error);
    });
  }
  
  cargarFoto() {
    let ruta: string = "usuarios/" + Date.now().toString();
    this.servicioFotos.addLibraryPhoto(ruta).then((data) => {
      this.chofer.foto = data;
    }, (error) => {
      console.log('Error: ' + error);
    });
  }

  private validar(): boolean {
    let c: Usuario = this.chofer;
    let res: boolean = c.nombre!=='' && c.apellido!==''&&c.clave!==''&&c.dni!==undefined&&c.correo!==''&&c.fechaNacimiento!==undefined&&c.foto!==undefined&&c.sexo!==undefined;
    
    if (this.clave1 !== this.clave2) {
      this.errorMsg('Error', 'Las contraseñas no coinciden.');
      return false;
    }

    if (this.clave1 === undefined || this.clave2 === undefined || this.clave2.length == 0 || this.clave1.length == 0) {
      this.errorMsg('Error', 'Las contraseñas no pueden estar en blanco.');
      return false;
    }
    
    if (this.chofer.foto === undefined) {
      this.errorMsg('Error', 'El chofer no tiene foto.');
      return false;
    }

    if (!res) {
      this.errorMsg('Error', 'Todos los campos son obligatorios.');
      return false;
    }
    this.chofer.clave = this.clave1;
    this.chofer.activo = (this.habilitado ? 1 : 0);
    return true;
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  errorMsg(titulo: string, mensaje: string) {
    const alerta = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      cssClass:"miClaseDanger",
      buttons: ['Aceptar']
    });
    alerta.present();
  }

  Msg(titulo: string, mensaje: string) {
    const alerta = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      cssClass:"miClaseAlert",
      buttons: ['Aceptar']
    });
    alerta.present();
  }
  
}
