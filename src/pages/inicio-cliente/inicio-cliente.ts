import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController,AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup ,FormControl,Validators} from '@angular/forms';

import { environment } from "../../environments/environment";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Usuario } from "../../clases/usuario";
//import { ServicioUsuariosProvider } from '../../providers/servicio-usuarios/servicio-usuarios';
//import { ServicioFotosProvider } from '../../providers/servicio-fotos/servicio-fotos';
import { TranslateService } from '@ngx-translate/core';
//import { VerImagenPage } from '../ver-imagen/ver-imagen';
import { AbmClienteProvider } from "../../providers/abm-cliente/abm-cliente";
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { QrVehiculoClientePage } from '../../pages/qr-vehiculo-cliente/qr-vehiculo-cliente';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { QrLeerVehiculoClientePage } from '../../pages/qr-leer-vehiculo-cliente/qr-leer-vehiculo-cliente';
import { NuevoViajePage } from '../nuevo-viaje/nuevo-viaje';
import { PagesModalPage } from '../pages-modal/pages-modal';
/**
 * Generated class for the InicioClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inicio-cliente',
  templateUrl: 'inicio-cliente.html',
})
export class InicioClientePage {
usuarioDatos;
nombre;
foto;
private spinner;

choferQr:any;
vehiculo;

private scanSub;

constructor(public navCtrl: NavController,
  public navParams: NavParams,
  private formBuilder: FormBuilder,
  private modalCtrl: ModalController,
 // private servicioUsuarios: ServicioUsuariosProvider,
 // private servicioFotos: ServicioFotosProvider,
  public viewCtrl: ViewController,
  private builder: FormBuilder,
  private camera: Camera,
  public alertCtrl: AlertController,
  private servicioCliente: AbmClienteProvider,
  private qrScanner: QRScanner)
 {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioClientePage');
    this.usuarioDatos = JSON.parse(sessionStorage.getItem('usuario'));
    this.nombre=this.usuarioDatos.nombre;
    this.foto=this.usuarioDatos.foto;
  }

  pedirViaje() {
    this.navCtrl.push(NuevoViajePage);
  }

  datosChofer()
  {        window.document.querySelector('ion-content').classList.add('transparentBody');
  window.document.querySelector('ion-app').classList.add('transparentBody');
  this.navCtrl.push(QrLeerVehiculoClientePage); // escaner QR
  }

  accederEncuesta()
  {
    this.modalCtrl.create(PagesModalPage, { titulo: 'Aviso', data: 'No implementado.'}).present();
  }

  modificar()
  {
    alert("No implementado todavia. Aca se va a poder modificar la foto del cliente y la clave");
  }

}
