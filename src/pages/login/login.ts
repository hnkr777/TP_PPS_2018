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
import { AltaClientePage } from "../../pages/alta-cliente/alta-cliente";
import { InicioClientePage } from "../../pages/inicio-cliente/inicio-cliente";
//PARA PRUEBA ESTA PAGINA, LUEGO SACARLAs
import { AbmClientesPage } from '../../pages/abm-clientes/abm-clientes';

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
        this.loginFields.email = "administrador";
        this.loginFields.clave = '11';
        break;

      case 2:
      this.loginFields.email = "mauro";
      this.loginFields.clave = '123';
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
        { text: 'Cliente (Mauro)', handler: () => {this.setLog(2);}},
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
    //COMO LO HIZO FEDE
    /*let modal = this.modalCtrl.create(SpinnerPage);
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
*/


let modal = this.modalCtrl.create(SpinnerPage);
modal.present();
this.coleccionTipadaFirebase = this.objFirebase.collection<any>('usuarios');
this.ListadoUsuariosObservable = this.coleccionTipadaFirebase.valueChanges();
this.ListadoUsuariosObservable.subscribe(x => {
  console.info("Conexión correcta con Firebase. Usuarios: ", x);
});

this.ListadoUsuariosObservable.forEach((el)=>{
  this.accounts = el;
  let user: any = this.accounts.find(elem => ( this.loginFields.email == elem.nombre && (this.loginFields.clave == elem.clave)));
  modal.dismiss();
  if( user !== undefined ) {
    sessionStorage.setItem('usuario', JSON.stringify(user));

    if(user.perfil=="cliente")
      {
        if(user.activo==0)
          {
            let toastNoActivo = this.toastCtrl.create({
              message: "Su usuario aun debe ser habilitado por el personal",
              duration: 4000,
              position: 'bottom' //middle || top
            });
            toastNoActivo.present();
          }
          else{
        this.navCtrl.push(InicioClientePage);
          }
      }
      else{
    //this.ModalVotacion();
      //ESTO ESTA DE PRUEBA, ESTA PAGINA DEBERIA ESTAR DENTRO DEL PERFIL DE ADMINISTRADOR O SUPERVISOR
    this.navCtrl.push(AbmClientesPage);
      }
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

  Redireccionar()
  {
    this.navCtrl.push(AltaClientePage);
    
  }
}

