import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, ModalController, ActionSheetController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Usuario } from '../../clases/usuario';

import { User, Settings } from '../../providers/providers';
import { MainPage } from '../pages';
import { ContentPage } from "../content/content";
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { PagesModalVotacionPage } from "../../pages/pages-modal-votacion/pages-modal-votacion";
import { ServicioUsuariosProvider } from '../../providers/servicio-usuarios/servicio-usuarios';
import { AdminControlPanelPage } from '../admin-control-panel/admin-control-panel';
import { ChoferPanelPage } from '../chofer-panel/chofer-panel';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  coleccionTipadaFirebase: AngularFirestoreCollection<Usuario>;
  ListadoUsuariosObservable: Observable<Usuario[]>;

  loginFields: { email: string, clave: string } = {
    email: 'admin@gmail.com',  // hardcodeado para hacer más rápido los test
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
    private objFirebase: AngularFirestore) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    });

  }
  
  setLog(i: number) {
    switch (i) {
      case 1:
        this.loginFields.email = "admin@gmail.com";
        this.loginFields.clave = '11';
        break;

      case 2:
      this.loginFields.email = "invitado@gmail.com";
      this.loginFields.clave = '22';
        break;

      case 3:
      this.loginFields.email = "usuario@gmail.com";
      this.loginFields.clave = '33';
        break;

      case 4:
      this.loginFields.email = "mschumi@gmail.com";
      this.loginFields.clave = '44';
        break;

      case 5:
      this.loginFields.email = "tester@gmail.com";
      this.loginFields.clave = '55';
        break;
    
      default:
        break;
    }
  }
  
  mostrarUsuarios() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Ingresar como...',
      enableBackdropDismiss: true,
      cssClass: 'actSheet',
      buttons: [
        { text: 'administrador (admin)', handler: () => {this.setLog(1);}},
        { text: 'invitado', handler: () => {this.setLog(2);}},
        { text: 'usuario', handler: () => {this.setLog(3);}},
        { text: 'Schumacher (chofer)', handler: () => {this.setLog(4);}},
        { text: 'tester', handler: () => {this.setLog(5);}},
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
    let modal = this.modalCtrl.create(SpinnerPage);
    modal.present();
    let ob = this.servicioUsuarios.traerUsuarios().subscribe(arr => {
      this.accounts = arr;
      console.log(arr);
      let user: Usuario = this.accounts.find(elem => ( this.loginFields.email == elem.email && (this.loginFields.clave == elem.clave)));
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
        console.log('Bienvenido administrador ' + usuario.email);
        this.navCtrl.setRoot(AdminControlPanelPage); // así seteamos una página directamente, no hay stack
      break;

      case 'chofer':
        console.log('Bienvenido chofer ' + usuario.email);
        this.navCtrl.setRoot(ChoferPanelPage); // así seteamos una página directamente, no hay stack
      break;

      case 'supervisor':
        console.log('Bienvenido supervisor ' + usuario.email);
        
      break;

      case 'cliente':
        console.log('Bienvenido cliente ' + usuario.email);
        
      break;
    
      default:
        break;
    }
    
  }

}
