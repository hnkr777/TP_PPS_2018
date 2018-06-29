import { Component, Input, Output } from '@angular/core';
import { IonicPage, ModalController, ViewController, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Observable } from 'rxjs/Observable';

// import { MainPage } from '../pages';
// import { Usuario } from '../../clases/usuario';
import { PagesModalPage } from "../pages-modal/pages-modal";
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { TranslateService } from '@ngx-translate/core';
import { QrVehiculoClientePage } from '../../pages/qr-vehiculo-cliente/qr-vehiculo-cliente';
import { AbmClienteProvider } from "../../providers/abm-cliente/abm-cliente";
import { InicioClientePage } from '../../pages/inicio-cliente/inicio-cliente';
import { EncuestaClientePage } from '../../pages/encuesta-cliente/encuesta-cliente';

/**
 * Generated class for the QrLeerEncuestaClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr-leer-encuesta-cliente',
  templateUrl: 'qr-leer-encuesta-cliente.html',
})
export class QrLeerEncuestaClientePage {

  private scanSub;
  private usuarioDatos;
  viaje;
  constructor(
    public modalCtrl: ModalController, 
    public navCtrl: NavController, 
    public qrScanner: QRScanner, 
    public platform: Platform,
    public viewCtrl : ViewController,
    public alertCtrl: AlertController,
    private servicioCliente: AbmClienteProvider,
    public navParams: NavParams
  ) {
    this.usuarioDatos = JSON.parse(sessionStorage.getItem('usuario'));
    this.viaje = this.navParams.get('viaje');
    console.log(this.viaje);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrLeerEncuestaClientePage');
    this.Scan();
  }

  ionViewWillLeave() {
    if(this.scanSub !== undefined) {
      this.qrScanner.hide(); // hide camera preview
      this.scanSub.unsubscribe(); // stop scanning
      console.log('Escaneo QR finalizado');
    }
  }

  Scan() {
    console.log('Iniciando escaneo QR');
    window.document.querySelector('ion-content').classList.add('transparentBody');
    window.document.querySelector('ion-app').classList.add('transparentBody');

    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
 
        this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
          //alert(text);
          this.qrScanner.hide(); // hide camera preview
          this.scanSub.unsubscribe(); // stop scanning
          //this.navCtrl.setRoot(QrVehiculoClientePage,{chofer: this.choferQr })
          if(text=="encuestaCliente")
            {
          this.navCtrl.setRoot(EncuestaClientePage,{viaje:this.viaje});
            }
            else
              {
                let alerta = this.alertCtrl.create({
                  title: "Error!",
                  subTitle: "No es un código de encuesta",
                  cssClass:"miClaseDanger",
                buttons: ['Aceptar']
              });
               alerta.present();

                this.navCtrl.setRoot(InicioClientePage);
              }
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

  close() {
    
  }

}
