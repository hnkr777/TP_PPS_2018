import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, ModalController, ActionSheetController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Usuario } from '../../clases/usuario';

import { User, Settings, EnviarMailProvider } from '../../providers/providers';
import { ServicioAudioProvider } from '../../providers/servicio-audio/servicio-audio';
import { MainPage } from '../pages';
import { ContentPage } from "../content/content";
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { PagesModalVotacionPage } from "../../pages/pages-modal-votacion/pages-modal-votacion";
import { ServicioUsuariosProvider } from '../../providers/servicio-usuarios/servicio-usuarios';
import { AdminControlPanelPage } from '../admin-control-panel/admin-control-panel';
import { ChoferPanelPage } from '../chofer-panel/chofer-panel';
import { AltaClientePage } from "../../pages/alta-cliente/alta-cliente";
import { InicioClientePage } from "../../pages/inicio-cliente/inicio-cliente";
//PARA PRUEBA ESTA PAGINA, LUEGO SACARLAs
import { AbmClientesPage } from '../../pages/abm-clientes/abm-clientes';

import { AbmVehiculosPage } from '../abm-vehiculos/abm-vehiculos';
import { ListadoChoferesDisponiblesPage } from '../listado-choferes-disponibles/listado-choferes-disponibles';
import { EncuestaSupervisorPage } from '../encuesta-supervisor/encuesta-supervisor';
import { EncuestaChoferPage } from '../encuesta-chofer/encuesta-chofer';
import { SuperControlPanelPage } from '../supervisor-control-panel/supervisor-control-panel';
import { EncuestaClientePage } from '../encuesta-cliente/encuesta-cliente';
import { QrVehiculoClientePage } from '../qr-vehiculo-cliente/qr-vehiculo-cliente';
import { InAppBrowser } from '../../../node_modules/@ionic-native/in-app-browser';
import { MostrarImgPage } from '../mostrar-img/mostrar-img';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  coleccionTipadaFirebase: AngularFirestoreCollection<Usuario>;
  ListadoUsuariosObservable: Observable<Usuario[]>;
  muteSound:boolean;
  loginFields: { correo: string, clave: string } = {
    correo: 'admin@gmail.com',  // hardcodeado para hacer más rápido los test
    clave: '11'
  };
  
  accounts: Array<Usuario>;
  
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public modalVotacion: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController, 
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private servicioUsuarios: ServicioUsuariosProvider,
    private objFirebase: AngularFirestore,
    private mails: EnviarMailProvider,
    public audioService:ServicioAudioProvider,
    public inab:InAppBrowser) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => { // así se traen string de traduccion...
      this.loginErrorString = value;
    });
    this.muteSound = false;
    this.muteAudio();
  }
  
  setLog(i: number) {
    switch (i) {
      case 1:
        this.loginFields.correo = "admin@gmail.com";
        this.loginFields.clave = '11';
        break;

      case 2:
      this.loginFields.correo = "pepeargento@gmail.com";
      this.loginFields.clave = '123';
        break;

      case 3:
      this.loginFields.correo = "super@gmail.com";
      this.loginFields.clave = '123';
        break;

      case 4:
      this.loginFields.correo = "mschumi@gmail.com";
      this.loginFields.clave = '123';
        break;

      case 5:
      this.loginFields.correo = "tester@gmail.com";
      this.loginFields.clave = '55';
        break;
    
      default:
        break;
    }
  }
  
  mostrarUsuarios() {
    this.audioService.reproducirClick();
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Ingresar como...',
      enableBackdropDismiss: true,
      cssClass: 'actSheet',
      buttons: [
        { text: 'administrador (admin)', handler: () => {this.setLog(1);}},
        //{ text: 'invitado', handler: () => {this.setLog(2);}},
        //{ text: 'admin', handler: () => {this.setLog(1);}},
        { text: 'Pepe (cliente)', handler: () => {this.setLog(2);}},
        { text: 'Super (supervisor)', handler: () => {this.setLog(3);}},
        { text: 'Schumacher (chofer)', handler: () => {this.setLog(4);}},
        { text: 'tester (baneado)', handler: () => {this.setLog(5);}},
        {
          text: 'Cancelar', cssClass: 'btnCancel', role: 'cancel', handler: () => {  }
        }
      ]
    });
    actionSheet.id = 'actSheet';
    actionSheet.present();
  }

  // ionViewDidLoad() {
  //   setTimeout(() => this.splash = false, 4000); // este es el tiempo del splashscreen, default 4000
  // }
  
  doLogin() {
    this.audioService.reproducirClick();
    let modal = this.modalCtrl.create(SpinnerPage);
    modal.present();
    let ob = this.servicioUsuarios.traerUsuarios().subscribe(arr => {
      this.accounts = arr;
      console.log(arr);
      let user: Usuario = this.accounts.find(elem => ( this.loginFields.correo == elem.correo && (this.loginFields.clave == elem.clave)));
      modal.dismiss();
      ob.unsubscribe();
      if (user !== undefined && user.activo == 1) {
        sessionStorage.setItem('usuario', JSON.stringify(user));
        this.IrRutaPorPerfil(user);
      } else {
        let toast = this.toastCtrl.create({
          message: ( user !== undefined && user.activo == 0 ? 'Usuario dado de baja.' : 'Acceso denegado.'),
          duration: 4000,
          position: 'bottom' //middle || top
        });
        this.audioService.reproducirError();
        toast.present();
      }
    });


  }
  
  // esta es la función principal de ruteo por perfil, 
  // define de acuerdo al perfil del usuario que loguea, a que ruta lo lleva
  IrRutaPorPerfil(usuario: Usuario) {
    // this.modalVotacion.create(PagesModalVotacionPage).present(); // modal para test varios
    // this.navCtrl.push(MainPage); // así agregamos una página al stack de páginas, para navegarlas y poder volver atrás con el botón back
    switch (usuario.perfil.toLowerCase()) {
      case 'admin':
        console.log('Bienvenido administrador ' + usuario.correo);
        this.navCtrl.setRoot(AdminControlPanelPage); // así seteamos una página directamente, no hay stack
      break;

      case 'chofer':
        console.log('Bienvenido chofer ' + usuario.correo);
        this.navCtrl.setRoot(ChoferPanelPage); // así seteamos una página directamente, no hay stack
      break;

      case 'supervisor':
        console.log('Bienvenido supervisor ' + usuario.correo);
        this.navCtrl.setRoot(SuperControlPanelPage);
      break;

      case 'cliente':
        console.log('Bienvenido cliente ' + usuario.correo);
        this.navCtrl.setRoot(InicioClientePage);
      break;
    
      default:
        break;
    }
    
  }
  
  Redireccionar()
  {
    this.audioService.reproducirClick();
    this.navCtrl.push(AltaClientePage);
  }
    
  goVehiculo(){ 
    this.navCtrl.push(AbmVehiculosPage,{data:"Lista"});
  }
  goListadoChoferes(){
    //this.navCtrl.push(ContentPage,{data:"supervisorLC"}); // PROBAR CEL
    this.navCtrl.push(ListadoChoferesDisponiblesPage); // PROBAR PC
  }
  goEncuesta(){
    //this.navCtrl.push(ContentPage,{data:"supervisorEC"}); // PROBAR CEL
    //this.navCtrl.push(EncuestaSupervisorPage); // PROBAR PC
    this.navCtrl.push(EncuestaChoferPage); // PROBAR PC
    //this.navCtrl.push(EncuestaClientePage); // PROBAR PC
  }
  muteAudio(){
    this.muteSound = !this.muteSound;
    this.audioService.mute = this.muteSound;
    console.log(this.audioService.mute);
  }
  testAudio(){
    this.audioService.reproducirClick();
  }
  goTest(){
    this.servicioUsuarios.traerUsuarioPorEmail("mschumi@gmail.com").subscribe(x=>{
      this.navCtrl.push(QrVehiculoClientePage,{chofer:x[0]}); // PROBAR PC   
    })
  }
  goLinkApidoc(){
    this.inab.create("http://juanmurciautn.hol.es/DocApiDoc/");
  }
  goLinkCompoDoc(){
    this.inab.create("http://juanmurciautn.hol.es/DocCompoDoc/");
  }
  goMostrar(){
    this.navCtrl.push(MostrarImgPage,{img:"TutoLogin",gif:true});
  }
}