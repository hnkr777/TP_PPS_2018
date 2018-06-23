import { Component, Input, Output } from '@angular/core';
import { IonicPage, ModalController, ViewController, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Observable } from 'rxjs/Observable';

// import { MainPage } from '../pages';
// import { Usuario } from '../../clases/usuario';
import { PagesModalPage } from "../pages-modal/pages-modal";
import { ListadoChoferesDisponiblesPage } from "../listado-choferes-disponibles/listado-choferes-disponibles";
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { TranslateService } from '@ngx-translate/core';
import { Usuario } from '../../clases/usuario';
import { ServicioUsuariosProvider } from '../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-content',
  templateUrl: 'content.html'
})
export class ContentPage {
  private scanSub;
  public quienMeLLama;
  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController, 
    public navCtrl: NavController, 
    public qrScanner: QRScanner, 
    public platform: Platform,
    public viewCtrl : ViewController,
    public alertCtrl: AlertController,
    public servUsuarios: ServicioUsuariosProvider
  ) {
    this.quienMeLLama = this.navParams.get('data');
  }

  ionViewWillLeave() {
    if(this.scanSub !== undefined) {
      this.qrScanner.hide(); // hide camera preview
      this.scanSub.unsubscribe(); // stop scanning
      console.log('Escaneo QR finalizado');
    }
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesModalPage');
    this.Scan();
  }

  
  Scan() {
    console.log('Iniciando escaneo QR');
    window.document.querySelector('ion-content').classList.add('transparentBody');
    window.document.querySelector('ion-app').classList.add('transparentBody');

    //this.spin(false);
    // this.modalCtrl.create(ContentPage).present();

    // Optionally request the permission early
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        // camera permission was granted
        //alert('authorized');
        // start scanning
        this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
          //console.log('Scanned something', text);
          
          //this.Modal('QR code:', text);
          this.queHagoScan(text); // <----- DECIDE QUE HACER
          
          this.qrScanner.hide(); // hide camera preview
          this.scanSub.unsubscribe(); // stop scanning
          console.log('Escaneo QR finalizado');
          this.closeModal();
          //this.showElements();
          this.navCtrl.pop();
        });
        this.qrScanner.resumePreview();
        // show camera preview
        this.qrScanner.show()
        .then((data : QRScannerStatus)=> { 
          //console.log('datashowing', data.showing);
          //alert(data.showing);
        },err => {
          //this.spin(false);
          this.Modal('Error: ', 'Detalles: '+ err);
        });

        // wait for user to scan something, then the observable callback will be called

      } else if (status.denied) {
        //this.spin(false);
        this.Modal('Permisos', 'Permisos a la cámara denegados.');
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there
      } else {
        // permission was denied, but not permanently. You can ask for permission again at a later time.
        //this.spin(false);
        this.Modal('Permisos', 'Permisos a la cámara denegados. Elija Aceptar la próxima vez.');
      }
    })
    .catch((e: any) => {
      //this.spin(false);
      this.Modal('Error: ', 'Detalles: '+ e);
    });
  }
  queHagoScan(textoScaneado:string){
    switch (this.quienMeLLama) {
      case "supervisor":
        if (textoScaneado == "ListaChoferesDisponibles") {
          /*this.qrScanner.hide(); // hide camera preview
          this.scanSub.unsubscribe(); // stop scanning
          console.log('Escaneo QR finalizado');*/
          this.navCtrl.push(ListadoChoferesDisponiblesPage);
        }
        else{
          this.Modal("Qr Scan",textoScaneado);
        }
        break;
      case 'chofer':
        if(textoScaneado == 'ChoferEmpezarATrabajar') {
          this.cambiarEstadoChofer();
          this.navCtrl.pop();
        }
      break;
    
      default:
        break;
    }
  }

  cambiarEstadoChofer() {
    let chofer: Usuario = JSON.parse(sessionStorage.getItem('usuario'));
    chofer.estado = 1;
    sessionStorage.setItem('usuario', JSON.stringify(chofer));
    this.servUsuarios.modificarUsuario(chofer);
  }
  
  Modal(titulo: string, data: any) {
    this.modalCtrl.create(PagesModalPage, { titulo: titulo, data: data }).present();
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

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
