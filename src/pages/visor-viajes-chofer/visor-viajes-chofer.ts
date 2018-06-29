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
import { VerImagenPage } from '../ver-imagen/ver-imagen';


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
  private filtro: string;
  miLatitudChofer;
  miLongitudChofer;
  mostrar;

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
    this.mostrar="asignados";
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
        this.spin(true);
        let now: number = Date.now();
        now += 30 * 60 * 1000; // cantidad de minutos * segundos (en 1 minuto) * milesimas de segundo (en 1 segundo)
        //console.log('now: ' + now.toString());
        //console.log(new Date(now).toLocaleString());
    
        let ob = this.servicioViajes.traerViajes().subscribe(data => {
          this.listaViajes = data;
          this.listaViajesAux = data;
          this.usuario = JSON.parse(sessionStorage.getItem("usuario"));

          
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

                }

                console.log("USUARUIOO: ");
                console.log(this.usuario);

                console.log("MOSTRAR: ");
                console.log(this.mostrar);

          this.spin(false);
        });



/*
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
                  console.log("me fijo si tengo algun viaje asignado por el supervisor");
                  console.log(viajePendiente);
                }
              //me fijo si tengo un viaje en curso
              if(data[i].correoChofer==this.usuario.correo && data[i].estado==1 )
                  {
                    this.listaViajes.push(data[i]);
                    viajePendiente=1;
                    console.log("me fijo si tengo un viaje en curso");
                    console.log(viajePendiente);
                  }
              if(viajePendiente==0)
                {
                  //trae todos los vijes sin asignacion y sin comenzar
              if(data[i].correoChofer=="" && data[i].estado==0 )
              {
                this.listaViajes.push(data[i]);
                console.log("trae todos los vijes sin asignacion y sin comenzar");
                console.log(viajePendiente);
              }
            }
            }
          }
          console.log(this.listaViajes);
          this.spin(false);
          //console.log('Cantidad viajes: ' + this.listaViajes.length);
          //ob.unsubscribe();
        });
        */
      }


      fitrarPorViajesEnCurso()
      {
        this.mostrar="enCurso";
        this.listaViajes=[];
        let now: number = Date.now();
        now += 30 * 60 * 1000;
        console.log(this.listaViajesAux);

        for(let i=0;i<this.listaViajesAux.length;i++)
          {
            if(this.listaViajesAux[i].estado == 1 && this.listaViajesAux[i].correoChofer==this.usuario.correo )
              {
                this.listaViajes.push(this.listaViajesAux[i]);
              }
          }
      }

      fitrarPorViajesAsignados()
      { 
      this.mostrar="asignados";
      this.listaViajes=[];
      let now: number = Date.now();
      now += 30 * 60 * 1000;
      console.log(this.listaViajesAux);

      for(let i=0;i<this.listaViajesAux.length;i++)
        {
          if(this.listaViajesAux[i].fechaSalida < now && this.listaViajesAux[i].estado == 0 && this.listaViajesAux[i].correoChofer==this.usuario.correo )
            {
              this.listaViajes.push(this.listaViajesAux[i]);
            }
        }
      }

      filtrarViajesSinAsignacion()
      {
        this.mostrar="sinAsignacion";
        this.listaViajes=[];
        let now: number = Date.now();
        now += 30 * 60 * 1000;
        console.log(this.listaViajesAux);
  
        for(let i=0;i<this.listaViajesAux.length;i++)
          {
            if(this.listaViajesAux[i].fechaSalida < now && this.listaViajesAux[i].estado == 0 && this.listaViajesAux[i].correoChofer=="")
              {
                this.listaViajes.push(this.listaViajesAux[i]);
              }
          }
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
  verImg(mail:string){
    console.log("MAIL: "+mail);
    /*let usuarios = this.servicioUsuarios.traerUsuarios().toPromise().then(x=>{
      console.log(x);
    })*/
    let usuarios = this.servicioUsuarios.traerUsuarioPorEmail(mail)
    usuarios.subscribe(x=>{
      //console.log("MOSTRA LA FOTO: "+JSON.stringify(x));
      if (x[0].foto == "" || x[0].foto === undefined) {
        this.modalCtrl.create(VerImagenPage,{imagen:'assets/img/perfildefaul.jpg'}).present();
      }
      else{
        this.modalCtrl.create(VerImagenPage,{imagen:x[0].foto}).present();
      }
      
    });
  }
}
