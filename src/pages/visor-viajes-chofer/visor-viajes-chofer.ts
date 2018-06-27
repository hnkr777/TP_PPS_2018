import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController, PopoverController } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { Usuario } from '../../clases/usuario';
import { Viaje } from '../../clases/viaje';
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { TranslateService } from '@ngx-translate/core';
import { ServicioFotosProvider, ServicioUsuariosProvider, ServicioViajesProvider, Settings } from '../../providers/providers';
import { Geolocation } from '@ionic-native/geolocation';
import { DetalleViajeChoferPage } from "../../pages/detalle-viaje-chofer/detalle-viaje-chofer";


/**
 * Generated class for the VisorViajesChoferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-visor-viajes-chofer',
  templateUrl: 'visor-viajes-chofer.html',
})
export class VisorViajesChoferPage {
 
  public listaViajes: any[];
  public listaViajesAux: any[];
  private viaje: Viaje;
  private spinner;
  private usuario;

  miLatitudChofer;
  miLongitudChofer;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private servicioUsuarios: ServicioUsuariosProvider,
    private servicioViajes: ServicioViajesProvider,
    public modalCtrl: ModalController,

    private servicioFotos: ServicioFotosProvider,
    public viewCtrl: ViewController,
    public translateService: TranslateService,
    public alertCtrl: AlertController,
    private geolocation: Geolocation,
    private popover: PopoverController ) {
 this.listaViajes=[];
 this.usuario = JSON.parse(sessionStorage.getItem("usuario"));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisorViajesChoferPage');
    this.spin(true);
    this.ubicacionActual();

  /*  let ob = this.servicioViajes.traerViajes().subscribe(data => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
      //console.log('data: ' + JSON.stringify(data));
      this.listaViajesAux = data;
      //ob.unsubscribe();
      console.log(this.listaViajesAux);
      this.mostrarViajesSinChofer();  
    });*/

    }

    ubicacionActual() {
      this.geolocation.getCurrentPosition().then((resp) => {
        console.log("latituddddd");
        console.log(resp.coords.latitude);
        this.miLatitudChofer=resp.coords.latitude;
        this.miLongitudChofer=resp.coords.longitude;
        this.filtrarViajesTest();
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }


      filtrarViajesTest() {
        let now: number = Date.now();
        now += 30 * 60 * 1000; // cantidad de minutos * segundos (en 1 minuto) * milesimas de segundo (en 1 segundo)
        //console.log('now: ' + now.toString());
        //console.log(new Date(now).toLocaleString());
    
        let ob = this.servicioViajes.traerViajes().subscribe(data => {
          let viajePendiente=0;
          this.listaViajes = undefined;
          this.listaViajes = new Array<Viaje>();
    
          for(let i: number = 0; i < data.length; i++) {
            if(data[i].fechaSalida < now ) {
              //me fijo si tengo algun viaje asignado por el supervisor
              if(data[i].correoChofer==this.usuario.correo && data[i].estado==0 )
                {
                  this.listaViajes.push(data[i]);
                  viajePendiente=1;
                }
              //me fijo si tengo un viaje en curso
              if(data[i].correoChofer==this.usuario.correo && data[i].estado==1 )
                  {
                    this.listaViajes.push(data[i]);
                    viajePendiente=1;
                  }
              if(viajePendiente==0)
                {
              if( data[i].correoChofer=="vacio"||data[i].correoChofer==""||data[i].correoChofer==undefined)
              {
                this.listaViajes.push(data[i]);
              }
            }
            }
          }
          console.log(this.listaViajes);
          this.spin(false);
          //console.log('Cantidad viajes: ' + this.listaViajes.length);
          //ob.unsubscribe();
        });
      }


  //funcion fuera de juego
  private mostrarViajesSinChofer()
  {
    this.listaViajes=[];
   for(let i=0;i<this.listaViajesAux.length;i++)
     {
       if(this.listaViajesAux[i].correoChofer=="vacio"||this.listaViajesAux[i].correoChofer==""||this.listaViajesAux[i].correoChofer==undefined)
         {
           this.listaViajes.push(this.listaViajesAux[i]); 
         }
     }
     console.log(this.listaViajes);
     this.spin(false);
  }


  mostrarViajeConMapa(viaje)
  {
    //asigno ubicacion actual del chofer
    viaje.miLatitudChofer=this.miLatitudChofer;
    viaje.miLongitudChofer=this.miLongitudChofer;
    
    this.modalCtrl.create(DetalleViajeChoferPage, {viaje: viaje}).present();
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
}
