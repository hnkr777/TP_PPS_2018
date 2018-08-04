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
import { ServicioAudioProvider } from '../../providers/servicio-audio/servicio-audio';
import { ThemeProvider } from '../../providers/theme/theme';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private servicioUsuarios: ServicioUsuariosProvider,
    private servicioFotos: ServicioFotosProvider,
    public viewCtrl: ViewController,
    public translateService: TranslateService,
    public alertCtrl: AlertController,
    public audioService:ServicioAudioProvider,
    private themes: ThemeProvider
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
    this.themes.refreshTheme();
  }

  verImagen() {
    if (this.supervisor.foto !== undefined) {
      this.modalCtrl.create(VerImagenPage, { imagen: this.supervisor.foto}).present();
    } else {
      this.Msg('Aviso', 'Sin foto');
    }
  }

  accionAceptar() {
    this.audioService.reproducirClick();
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
    this.audioService.reproducirClick();
    this.servicioUsuarios.modificarUsuario(this.supervisor);
    this.closeModal();
    this.Msg('Aviso', 'Supervisor modificado correctamente.');
  }

  nuevoChofer() {
    this.audioService.reproducirClick();
    this.servicioUsuarios.guardarNuevoUsuario(this.supervisor).then(data => {
      this.closeModal();
      console.log('Supervisor guardado correctamente.');
      this.Msg('Aviso', 'Supervisor guardado correctamente.');
    }).catch((error) => {
      console.log('Error: '+ error);
      this.errorMsg('Error', 'Error: '+ JSON.stringify(error));
    });
  }

  /*nuevoChofer() {
    this.audioService.reproducirClick();
    //console.warn('Correo: '+ corr);
    let ob = this.servicioUsuarios.traerUsuarioPorEmail(this.supervisor.correo) //this.supervisor.correo
    let res = ob.subscribe((usuarios: Array<Usuario>) => {
      console.warn('usuarios: '+ JSON.stringify(usuarios));
      let usuario: Usuario = usuarios.find((user) => {return this.supervisor.correo == user.correo;});
      console.warn('usuario: '+ JSON.stringify(usuario));
      if(usuario === undefined) { // el usuario.correo NO existe en firebase, entonces lo guardamos...
        res.unsubscribe();
        this.servicioUsuarios.guardarNuevoUsuario(this.supervisor).then(data => {
          this.closeModal();
          console.log('Supervisor guardado correctamente.');
          this.Msg('Aviso', 'Supervisor guardado correctamente.');
        }).catch((error) => {
          console.log('Error: '+ error);
          this.errorMsg('Error', 'Error: '+ error);
        });
      } else { // el usuario.correo ya existe en firebase...
        this.closeModal();
        console.error('Error: Correo del Supervisor ya existente.');
        this.errorMsg('Error', 'El correo del Supervisor ya existe.');
      }
    });
  }*/

  tomarFoto() {
    this.audioService.reproducirClick();
    let ruta: string = "usuarios/" + Date.now().toString();
    this.servicioFotos.takePhoto(ruta).then((data) => {
      this.supervisor.foto = data;
    }, (error) => {
      console.log('Error: ' + error);
    });
  }
  
  cargarFoto() {
    this.audioService.reproducirClick();
    let ruta: string = "usuarios/" + Date.now().toString();
    this.servicioFotos.addLibraryPhoto(ruta).then((data) => {
      this.supervisor.foto = data;
    }, (error) => {
      console.log('Error: ' + error);
    });
  }

  private validar(): boolean {
    let c: Usuario = this.supervisor;
    let res: boolean = c.nombre!=='' && c.apellido!==''&&c.clave!==''&&c.dni!==undefined&&c.correo!==''&&/*c.fechaNacimiento!==undefined&&c.foto!==undefined&&*/c.sexo!==undefined;
    
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
    this.audioService.reproducirError();
    const alerta = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      cssClass:"miClaseDanger",
      buttons: ['Aceptar']
    });
    alerta.present();
  }
  Msg(titulo: string, mensaje: string) {
        this.audioService.reproducirExito();
        const alerta = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      cssClass:"miClaseAlert",
      buttons: ['Aceptar']
    });
    alerta.present();
  }
  
}
