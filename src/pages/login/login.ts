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

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  coleccionTipadaFirebase:AngularFirestoreCollection<Usuario>;
  ListadoUsuariosObservable: Observable<Usuario[]>;

  loginFields: { email: string, clave: string } = {
    email: '',
    clave: ''
  };
  
  splash = true;
  accounts: Array<Usuario>;
  
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public modalVotacion: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController, 
    public toastCtrl: ToastController,
    public translateService: TranslateService,
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
      this.loginFields.email = "anonimo@gmail.com";
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
        { text: 'admin', handler: () => {this.setLog(1);}},
        { text: 'invitado', handler: () => {this.setLog(2);}},
        { text: 'usuario', handler: () => {this.setLog(3);}},
        { text: 'anonimo', handler: () => {this.setLog(4);}},
        { text: 'tester', handler: () => {this.setLog(5);}},
        {
          text: 'Cancelar', cssClass: 'btnCancel', role: 'cancel', handler: () => {  }
        }
      ]
    });
    actionSheet.id = 'actSheet';
    actionSheet.present();
  }

  ionViewDidLoad() {
    setTimeout(() => this.splash = false, 4000);
  }
  
  doLogin() {
    let modal = this.modalCtrl.create(SpinnerPage);
    modal.present();
    this.coleccionTipadaFirebase = this.objFirebase.collection<Usuario>('usuarios', ref=> ref.orderBy('id','asc'));
    this.ListadoUsuariosObservable = this.coleccionTipadaFirebase.valueChanges();
    this.ListadoUsuariosObservable.subscribe(x => {
      console.info("Conexión correcta con Firebase. Usuarios: ", x);
    });
    
    this.ListadoUsuariosObservable.forEach((el)=>{
      this.accounts = el;
      let user: Usuario = this.accounts.find(elem => ( this.loginFields.email == elem.nombre && (this.loginFields.clave == elem.clave)));
      modal.dismiss();
      if( user !== undefined ) {
        sessionStorage.setItem('usuario', JSON.stringify(user));
        this.ModalVotacion();
        //this.navCtrl.push(MainPage);
      } else {
        let toast = this.toastCtrl.create({
          message: "Acceso denegado.",
          duration: 4000,
          position: 'bottom' //middle || top
        });
        toast.present();
      }
    });

  }
  
  ModalVotacion() {
    this.modalVotacion.create(PagesModalVotacionPage).present();
  }

}
