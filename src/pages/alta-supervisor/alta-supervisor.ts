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
 * AltaSupervisorPage
 *
 * Se muestra como modal, alta de nuevo supervisor
 * O se puede editar un supervisor existente, pasándole el supervisor por navParams
 */

@IonicPage()
@Component({
  selector: 'alta-supervisor-page',
  templateUrl: 'alta-supervisor.html',
})
export class AltaSupervisorPage {
  private supervisor: Usuario;
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
      let supervisor = navParams.get('supervisor');
      
      if(supervisor !== undefined) { // entramos en modo modificación
        this.modoAlta = false;
        this.supervisor = supervisor;
        this.habilitado = supervisor.activo == 1;
        this.clave1 = supervisor.clave;
        this.clave2 = supervisor.clave;
        console.log('AltaChoferPage: modificando chofer ' + this.supervisor.correo);
      } else { // sino, en modo alta nuevo chofer
        this.modoAlta = true;
        this.habilitado = true;
        this.supervisor = new Usuario('supervisor');
        this.supervisor.foto = undefined;
        console.log('AltaSupervisorPage: nuevo supervisor');
      }

      this.validos = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaSupervisorPage');
    
  }

  verImagen() {
    if (this.supervisor.foto !== undefined) {
      this.modalCtrl.create(VerImagenPage, { imagen: this.supervisor.foto}).present();
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
    this.servicioUsuarios.modificarUsuario(this.supervisor);
    this.closeModal();
  }

  nuevoChofer() {
    this.servicioUsuarios.guardarNuevoUsuario(this.supervisor).then(data => {
      this.closeModal();
      console.log('Supervisor guardado correctamente.');
      this.Msg('Aviso', 'Supervisor guardado correctamente.');
    }).catch((error) => {
      console.log('Error: '+ error);
      this.errorMsg('Error', 'Error: '+ error);
    });
  }

  tomarFoto() {
    let ruta: string = "usuarios/" + Date.now().toString();
    this.servicioFotos.takePhoto(ruta).then((data) => {
      this.supervisor.foto = data;
    }, (error) => {
      console.log('Error: ' + error);
    });
  }
  
  cargarFoto() {
    let ruta: string = "usuarios/" + Date.now().toString();
    this.servicioFotos.addLibraryPhoto(ruta).then((data) => {
      this.supervisor.foto = data;
    }, (error) => {
      console.log('Error: ' + error);
    });
  }

  private validar(): boolean {
    let c: Usuario = this.supervisor;
    let res: boolean = c.nombre!=='' && c.apellido!==''&&c.clave!==''&&c.dni!==undefined&&c.correo!==''&&c.fechaNacimiento!==undefined&&/*c.foto!==undefined&&*/c.sexo!==undefined;
    
    if (this.clave1 !== this.clave2) {
      this.errorMsg('Error', 'Las contraseñas no coinciden.');
      return false;
    }

    if (this.clave1 === undefined || this.clave2 === undefined || this.clave2.length == 0 || this.clave1.length == 0) {
      this.errorMsg('Error', 'Las contraseñas no pueden estar en blanco.');
      return false;
    }
    
    /*if (this.supervisor.foto === undefined) {
      this.errorMsg('Error', 'El supervisor no tiene foto.');
      return false;
    }*/

    if (!res) {
      this.errorMsg('Error', 'Todos los campos son obligatorios.');
      return false;
    }
    this.supervisor.clave = this.clave1;
    this.supervisor.activo = (this.habilitado ? 1 : 0);
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