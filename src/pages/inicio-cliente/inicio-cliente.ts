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

 

  datosChofer()
  {    


    //este campo despues los voy a tener que leer del qr
    let correo="mfang@gmail.com";
    //a este campo despues le voy a asiganar this.choferQr.patente
    let patente='AAAA0000';

    let ob = this.servicioCliente.traerUsuariosPorPerfil('chofer').subscribe(data => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
      //console.log(data);
      for(let i=0;i<data.length;i++)
        {
          if(data[i].correo==correo)
            {
              this.choferQr=data[i];
            }
        }

        if(this.choferQr==undefined)
          {
            alert("Este codigo no corresponde a un chofer");
          }
          console.log("CHOFER:");
      console.log(this.choferQr);

      let ob2 = this.servicioCliente.traerVehiculoPorPatente(patente).subscribe(data => {  
        this.vehiculo=data;
        console.log("VEHICULO:");
        console.log(this.vehiculo);
        console.log("5");
        this.choferQr.color=this.vehiculo[0].color;
        this.choferQr.modelo=this.vehiculo[0].modelo;
        this.choferQr.patente=this.vehiculo[0].patente;
        this.choferQr.fotosVehiculo=this.vehiculo[0].fotos;
        this.choferQr.activoVehiculo=this.vehiculo[0].activo; 
        this.modalCtrl.create(QrVehiculoClientePage,{chofer: this.choferQr }).present();
      });
console.log("3");
console.log("4");
//console.log(this.vehiculo);
     
    });
    console.log("1");
    console.log("2");

  }

  accederEncuesta()
  {

  }

}
