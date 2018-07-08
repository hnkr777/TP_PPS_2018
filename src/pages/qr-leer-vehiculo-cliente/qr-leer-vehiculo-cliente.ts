import { Component, Input, Output } from '@angular/core';
import { IonicPage, ModalController, ViewController, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Observable } from 'rxjs/Observable';
import { ServicioAudioProvider } from "../../providers/servicio-audio/servicio-audio";
// import { MainPage } from '../pages';
// import { Usuario } from '../../clases/usuario';
import { PagesModalPage } from "../pages-modal/pages-modal";
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { TranslateService } from '@ngx-translate/core';
import { QrVehiculoClientePage } from '../../pages/qr-vehiculo-cliente/qr-vehiculo-cliente';
import { AbmClienteProvider } from "../../providers/abm-cliente/abm-cliente";
import { InicioClientePage } from '../../pages/inicio-cliente/inicio-cliente';
/**
 * Generated class for the QrLeerVehiculoClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr-leer-vehiculo-cliente',
  templateUrl: 'qr-leer-vehiculo-cliente.html',
})
export class QrLeerVehiculoClientePage {

  private scanSub;
  private usuarioDatos;
  private choferQr;
  private vehiculo;
  constructor(
    public modalCtrl: ModalController, 
    public navCtrl: NavController, 
    public qrScanner: QRScanner, 
    public platform: Platform,
    public viewCtrl : ViewController,
    public alertCtrl: AlertController,
    private servicioCliente: AbmClienteProvider,
    public audioService: ServicioAudioProvider
  ) {
    this.usuarioDatos = JSON.parse(sessionStorage.getItem('usuario'));
    //console.log(this.usuarioDatos);
  }


  ionViewDidLoad() {
    
    console.log('ionViewDidLoad QrLeerVehiculoClientePage');
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

          //let patente='CCCC3333';
          
              let ob = this.servicioCliente.traerUsuariosPorPerfil('chofer').subscribe(data => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
                //console.log(data);
                for(let i=0;i<data.length;i++)
                  {
                    if(data[i].correo==text)
                      {
                       // alert("enctro al chofer");
                        this.choferQr=data[i];
                      }
                  }
          
                  if(this.choferQr==undefined)
                    {     const alerta = this.alertCtrl.create({
                      title: 'Error!',
                      subTitle: 'Este código no corresponde a un chofer',
                      cssClass:"miClaseDanger",
                      buttons: ['Aceptar']
                    });
                    this.audioService.reproducirError();
                    alerta.present();
                    this.navCtrl.setRoot(InicioClientePage);
                    }
                    console.log("CHOFER:");
                console.log(this.choferQr);
          
                let ob2 = this.servicioCliente.traerVehiculoPorPatente(this.choferQr.patente).subscribe(data => {  
                  this.vehiculo=data;
                  console.log("VEHICULO:");
                  console.log(this.vehiculo);
                  console.log("5");
                  this.choferQr.color=this.vehiculo[0].color;
                  this.choferQr.modelo=this.vehiculo[0].modelo;
                  this.choferQr.patente=this.vehiculo[0].patente;
                  this.choferQr.fotosVehiculo=this.vehiculo[0].fotos;
                  this.choferQr.activoVehiculo=this.vehiculo[0].activo; 
                  this.navCtrl.setRoot(QrVehiculoClientePage,{chofer: this.choferQr })
                  this.qrScanner.hide(); // hide camera preview
                  this.scanSub.unsubscribe(); // stop scanning
                  ob2.unsubscribe(); ////////////////////////////////////////////////////
                });
          console.log("3");
          console.log("4");
          //console.log(this.vehiculo);
               ob.unsubscribe(); ///////////////////////////////////////////////////
              });
              console.log("1");
              console.log("2");
           
 
          
        /* this.qrScanner.hide(); // hide camera preview
          this.scanSub.unsubscribe(); // stop scanning
          console.log('Escaneo QR finalizado');*/
         // this.closeModal();
          //this.showElements();
         // this.navCtrl.pop();
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
    this.audioService.reproducirError();
    alerta.present();
  }

  Msg(titulo: string, mensaje: string) {
    const alerta = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      cssClass:"miClaseAlert",
      buttons: ['Aceptar']
    });
    this.audioService.reproducirExito();
    alerta.present();
  }

  close() {
    
  }


}
