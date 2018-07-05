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

import { ServicioAudioProvider } from "../../providers/servicio-audio/servicio-audio";
import { vehiculo } from '../../clases/vehiculo';
import { ServicioVehiculoProvider } from '../../providers/servicio-vehiculo/servicio-vehiculo';
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
  private usuarios: any;
  public vehiculos: vehiculo[];
  public patenteAnterior: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private servicioUsuarios: ServicioUsuariosProvider,
    private servicioFotos: ServicioFotosProvider,
    public viewCtrl: ViewController,
    public translateService: TranslateService,
    public alertCtrl: AlertController,
    public audioService:ServicioAudioProvider,
    private servicioVehiculos: ServicioVehiculoProvider
  ) {
      let chofer = navParams.get('chofer');
      
      if(chofer !== undefined) { // entramos en modo modificación
        this.modoAlta = false;
        this.chofer = chofer;
        this.habilitado = chofer.activo == 1;
        this.clave1 = chofer.clave;
        this.clave2 = chofer.clave;
        this.patenteAnterior = this.chofer.patente !== undefined ? this.chofer.patente : '';
        console.log('AltaChoferPage: modificando chofer ' + this.chofer.correo);
      } else { // sino, en modo alta nuevo chofer
        this.modoAlta = true;
        this.habilitado = true;
        this.chofer = new Usuario('chofer');
        this.chofer.foto = undefined;
        //this.patente = '';
        this.chofer.patente = '';
        console.log('AltaChoferPage: nuevo chofer');
      }
      this.loadUsers();
      this.loadVehicles();
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
    this.servicioVehiculos.cambiarEstadoVehiculoPorPatente(this.patenteAnterior, 0);
    console.warn('Patente anterior: ' + this.patenteAnterior);
    this.servicioVehiculos.cambiarEstadoVehiculoPorPatente(this.chofer.patente, 1);
    console.warn('Patente nueva: ' + this.chofer.patente);
    this.servicioUsuarios.modificarUsuario(this.chofer);
    this.closeModal();
  }

  test() {
    console.warn('TEST...'+this.chofer.patente);

    //console.log('patente: '+ this.patente);
    //this.servicioVehiculos.cambiarEstadoVehiculoPorPatente(this.chofer.patente, 2);
    //this.nuevoChofer();
  }

  nuevoChofer() {
    this.audioService.reproducirClick();
    let usuario: Usuario = this.usuarios.find((user) => {return this.chofer.correo == user.correo;});
    if(usuario === undefined) { // el usuario.correo NO existe en firebase, entonces lo guardamos...
      this.servicioUsuarios.guardarNuevoUsuario(this.chofer).then(data => {
        if(this.patenteAnterior === undefined){
          this.patenteAnterior = "";
        }
        this.servicioVehiculos.cambiarEstadoVehiculoPorPatente(this.patenteAnterior, 0);
        console.warn('Patente anterior: ' + this.patenteAnterior);
        this.servicioVehiculos.cambiarEstadoVehiculoPorPatente(this.chofer.patente, 1);
        console.warn('Patente nueva: ' + this.chofer.patente);
        this.closeModal();
        console.log('Chofer guardado correctamente.');
        this.Msg('Aviso', 'Chofer guardado correctamente.');
      }).catch((error) => {
        console.log('Error: '+ error);
        this.errorMsg('Error', 'Error: '+ error);
      });
    } else { // el usuario.correo ya existe en firebase...
      this.closeModal();
      console.error('Error: Correo del Chofer ya existente.');
      this.errorMsg('Error', 'El correo del Chofer ya existe.');
    }
  }

  loadUsers() {
    let ob = this.servicioUsuarios.traerUsuarios();
    let res = ob.subscribe((arrayUsuarios) => {
      this.usuarios = arrayUsuarios;
      res.unsubscribe();
      //console.warn('Todos los usuarios: ' + JSON.stringify(this.usuarios));
    });
  }

  loadVehicles() { // cargamos vehiculos que no esten en estado 1...
    this.vehiculos = new Array<vehiculo>();
    let ob = this.servicioVehiculos.traerVehiculos();
    let res = ob.subscribe((vehiculos) => {
      vehiculos.forEach(el => {
        if( el.estado === undefined || el.estado == 0 ) {
          this.vehiculos.push(el);
        }
      });
      res.unsubscribe();
      //console.warn(JSON.stringify(this.vehiculos));
    });
  }

  compareFn(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }

  tomarFoto() {
    this.audioService.reproducirClick();
    let ruta: string = "usuarios/" + Date.now().toString();
    this.servicioFotos.takePhoto(ruta).then((data) => {
      this.chofer.foto = data;
    }, (error) => {
      console.log('Error: ' + error);
    });
  }
  
  cargarFoto() {
    this.audioService.reproducirClick();
    let ruta: string = "usuarios/" + Date.now().toString();
    this.servicioFotos.addLibraryPhoto(ruta).then((data) => {
      this.chofer.foto = data;
    }, (error) => {
      console.log('Error: ' + error);
    });
  }

  //Para que los campos input sean solo letras
  public onKeyUpLetter(event: any, opt:string) {
    let newValue = event.target.value;
    let regExp = new RegExp('^[A-Za-z]+$');
    if (! regExp.test(newValue)) {
      event.target.value = newValue.slice(0, -1);
      switch (opt) {
        case "nombre":
          this.chofer.nombre = "";
          break;
        case "apellido":
          this.chofer.apellido = "";
          break;
      
        default:
          break;
      }
    }
  }
  public onKeyUpEmail(event: any) {
    let newValue = event.target.value;
    let regExp = new RegExp('/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/');
    if (!regExp.test(newValue)) {
      event.target.value = newValue.slice(0, -1);
      this.chofer.correo = "";
    }
  }
  //Para que los campos input sean solo numeros
  public onKeyUpNumber(event: any,opt:string) {
    let newValue = event.target.value;
    let regExp = new RegExp('^[0-9]+$');
    if (! regExp.test(newValue)) {
      event.target.value = newValue.slice(0, -1);
      this.chofer.dni = undefined;
    }
  }

  private validar(): boolean {
    let c: Usuario = this.chofer;
    let res: boolean = c.nombre!=='' && c.apellido!==''&&c.clave!==''&&c.dni!==undefined&&c.correo!==''/*&&c.fechaNacimiento!==undefined*/&&c.foto!==undefined&&c.sexo!==undefined;
    
    
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
    if (!this.validarEmail(this.chofer.correo)) {
      this.errorMsg('Error', 'Formato de correo inválido');
      return false;
    }
    /*if (!this.validarFecha(this.chofer.fechaNacimiento)) {
      this.errorMsg('Error', 'Se necesita ser mayor de edad (18 años)');
      return false;
    }*/
    /*if(!this.chofer.nombre.value.match(/^[A-Za-z\_\-\.\s\xF1\xD1]+$/))
    {
      this.formAlta.controls['nombre'].setValue("");
      const alerta = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'El nombre debe contener letras',
        cssClass:"miClaseDanger",
        buttons: ['Aceptar']
      });
      alerta.present();
      return;
    }*/
    this.chofer.clave = this.clave1;
    this.chofer.activo = (this.habilitado ? 1 : 0);
    return true;
  }
  validarFecha(fecha:Date){
    let mayor: number = Date.now();
    mayor += 60 * 60 * 1000 * 24 * 365 * 18; // cantidad de minutos * segundos (en 1 minuto) * milesimas de segundo (en 1 segundo)
    let fechaChofer = fecha.getTime();
    let aux:boolean = false;
    if (fechaChofer <= mayor) {
      aux = true;
    }
    return aux;
  }
  validarEmail(email:string){
    let aux:boolean = false;
    for (let i = 0; i < email.length; i++) {
      if (email[i] == '@') {
        aux=true;
      }
    }
    return aux;
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
