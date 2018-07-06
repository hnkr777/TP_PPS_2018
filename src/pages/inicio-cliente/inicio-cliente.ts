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
import { DetalleViajeClientePage } from "../../pages/detalle-viaje-cliente/detalle-viaje-cliente";
import { ServicioFotosProvider, ServicioUsuariosProvider, ServicioViajesProvider, Settings } from '../../providers/providers';
import { EditarPerfilClientePage } from '../../pages/editar-perfil-cliente/editar-perfil-cliente';
import { LoginPage } from '../login/login';
import { ServicioAudioProvider } from '../../providers/servicio-audio/servicio-audio';
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

public listaViajes: any[];
public listaViajesAux: any[];
private filtro: string;
mostrar;

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
  private qrScanner: QRScanner,
  private servicioViajes: ServicioViajesProvider,
  public audioService:ServicioAudioProvider)
 {
  this.listaViajes=[];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioClientePage');
    this.usuarioDatos = JSON.parse(sessionStorage.getItem('usuario'));
    this.nombre=this.usuarioDatos.nombre;
    this.foto=this.usuarioDatos.foto;
    this.mostrar="todos";
    this.filtrarViajes();
  }


  pedirViaje() {
    this.navCtrl.push(NuevoViajePage);
  }

  datosChofer()
  {        
    this.audioService.reproducirClick();
    window.document.querySelector('ion-content').classList.add('transparentBody');
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

  filtrarViajes()
  {
    console.log(this.usuarioDatos.correo);
    this.spin(true);
    let ob = this.servicioViajes.traerViajesFiltrados("correoCliente","==",this.usuarioDatos.correo).subscribe(data => {
      this.listaViajes = data;
      this.listaViajesAux = data;
      console.log(this.listaViajes);
      //this.usuario = JSON.parse(sessionStorage.getItem("usuario"));

      if(this.mostrar=="todos")
        {
          this.filtrarViajesTodos();
        }
        if(this.mostrar=="enCurso")
          {
            this.filtrarViajesEnCurso();
          }

          if(this.mostrar=="finalizados")
            {
              this.filtrarViajesFinalizados();
            }
            if(this.mostrar=="cancelados")
              {
                this.filtrarViajesCancelados();
              }
            
    /*  
      if(this.usuario.estado==2)
        {
          this.mostrar="enCurso";
          this.fitrarPorViajesEnCurso();
        }

          if(this.usuario.estado==1)
            {
              if(this.mostrar=="asignados")
                {
                  this.fitrarPorViajesAsignados();
                }
              if(this.mostrar=="sinAsignacion")
                {
                  this.filtrarViajesSinAsignacion();
                }
                if(this.mostrar=="enCurso")
                  {
                    this.mostrar=="asignados";
                    this.fitrarPorViajesAsignados();
                  }

            }*/

          /*  console.log("USUARUIOO: ");
            console.log(this.usuario);

            console.log("MOSTRAR: ");
            console.log(this.mostrar);*/

      this.spin(false);
    });
  }

  mostrarViajeConMapa(viaje)
  {
  //  this.modalCtrl.create(DetalleViajeClientePage, {viaje: viaje}).present();
  this.audioService.reproducirClick();
  this.navCtrl.setRoot(DetalleViajeClientePage, {viaje: viaje}); // escaner QR
  }


  filtrarViajesTodos()
  {
    this.mostrar="todos";
  }

  filtrarViajesEnCurso()
  {
    this.mostrar="enCurso";
    this.listaViajes=[];

    for(let i=0;i<this.listaViajesAux.length;i++)
      {
        if(this.listaViajesAux[i].estado == 1)
          {
            this.listaViajes.push(this.listaViajesAux[i]);
          }
      }
  }

  filtrarViajesFinalizados()
  {
    this.mostrar="finalizados";
    this.listaViajes=[];

    for(let i=0;i<this.listaViajesAux.length;i++)
      {
        if(this.listaViajesAux[i].estado == 2)
          {
            this.listaViajes.push(this.listaViajesAux[i]);
          }
      }
  }

  filtrarViajesCancelados()
  {
    this.mostrar="cancelados";
    this.listaViajes=[];

    for(let i=0;i<this.listaViajesAux.length;i++)
      {
        if(this.listaViajesAux[i].estado == 3 || this.listaViajesAux[i].estado == 4)
          {
            this.listaViajes.push(this.listaViajesAux[i]);
          }
      }
  }

  modificarDatos()
  {
    this.audioService.reproducirClick();
    this.navCtrl.push(EditarPerfilClientePage,{cliente:this.usuarioDatos});
  }


  private spin(status: boolean) {
    if(this.spinner === undefined && status === true) {
      this.spinner = this.modalCtrl.create(SpinnerPage);
      this.spinner.present();
    } else if(this.spinner !== undefined && status === false) {
      this.spinner.dismiss();
      this.spinner = undefined;
    }
  }

  /*pedirViaje() {
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
  }*/
  logout(){
    this.audioService.reproducirClick();
    sessionStorage.clear();
    this.navCtrl.setRoot(LoginPage);
  }

}
