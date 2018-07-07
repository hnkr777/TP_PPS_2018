
import { Component } from '@angular/core';
import { IonicPage, ModalController, ViewController, NavController, NavParams } from 'ionic-angular';
// import { TranslateModule } from '@ngx-translate/core';
// import { ServicioUsuariosProvider } from "../../providers/servicio-usuarios/servicio-usuarios";
// import { ServicioAudioProvider } from "../../providers/servicio-audio/servicio-audio";
// import { Encuesta } from '../../clases/encuesta';
// import { AltaChoferPage } from '../alta-chofer/alta-chofer';
import { ServicioEncuestasProvider } from "../../providers/servicio-encuestas/servicio-encuestas";
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
@IonicPage()
@Component({
  selector: 'page-pages-modal',
  templateUrl: 'pages-modal.html',
})
export class PagesModalPage {
  cuerpo: string = "";
  titulo: string = "";
  public doughnutChartData:number[] ;
  public doughnutChartType:string;
  public doughnutChartLabels:string[];
  public aData:number[] ;
  private spinner;
  public listaEstadisticas: any[];
  public auxListaEstadisticas: any[];
  private filtro;
  resultado1;
  resultado2;
  resultado3;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController, private servicioEncuestas: ServicioEncuestasProvider,  private modalCtrl: ModalController) {
    this.cuerpo = navParams.get('data');
    this.titulo = navParams.get('titulo');
    this.filtro = "cliente";
    this.listaEstadisticas=[];
    this.aData=[0,0,0];

    this.spin(true);
    let ob = this.servicioEncuestas.traerEncuestas().subscribe(data => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
      //console.log('data: ' + JSON.stringify(data));
      this.listaEstadisticas = data;
      this.spin(false);
      console.log(this.listaEstadisticas);
      //ob.unsubscribe();
      this.filtrarEncuestas();
    });

   
   //this.aData=[0,0,0];
    this.doughnutChartLabels= ['BUENO','REGULAR','MALO'];
    this.doughnutChartType = 'doughnut';
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesModalPage');
    //this.filtrarEncuestas();
  }

  filtrarEncuestas()
  {
    if(this.filtro=="cliente")
      {
        this.FiltrarPorPerfilCliente();
      }
      if(this.filtro=="chofer")
        {
          this.FiltrarPorPerfilChofer();
        }
        if(this.filtro=="supervisor")
          {
            this.FiltrarPorPerfilSupervisor();
          }
  }


FiltrarPorPerfilCliente()
{
  //alert("entro");
  this.resultado1=0;
  this.resultado2=0;
  this.resultado3=0;
  //this.listaEstadisticas=[];
  for(let i=0;i<this.listaEstadisticas.length;i++)
    {
      if(this.listaEstadisticas[i].perfil == "cliente" )
        {
          if(this.listaEstadisticas[i].respuesta=="1")
            {
             this.resultado1= this.resultado1+1;
            }
          if(this.listaEstadisticas[i].respuesta=="2")
            {
             this.resultado2= this.resultado2+1;
            }
            if(this.listaEstadisticas[i].respuesta=="3")
              {
               this.resultado3= this.resultado3+1;
              }
        }
    }
    console.log(this.listaEstadisticas);
    this.aData=[this.resultado1,this.resultado2,this.resultado3];
}

FiltrarPorPerfilChofer()
{
  this.resultado1=0;
  this.resultado2=0;
  this.resultado3=0;
  //this.listaEstadisticas=[];
  for(let i=0;i<this.listaEstadisticas.length;i++)
    {
      if(this.listaEstadisticas[i].perfil == "chofer" )
        {
          if(this.listaEstadisticas[i].respuesta=="1")
            {
             this.resultado1= this.resultado1+1;
            }
          if(this.listaEstadisticas[i].respuesta=="2")
            {
             this.resultado2= this.resultado2+1;
            }
            if(this.listaEstadisticas[i].respuesta=="3")
              {
               this.resultado3= this.resultado3+1;
              }
        }
    }
    console.log(this.listaEstadisticas);
    this.aData=[this.resultado1,this.resultado2,this.resultado3];
}

FiltrarPorPerfilSupervisor()
{
  this.resultado1=0;
  this.resultado2=0;
  this.resultado3=0;
  //this.listaEstadisticas=[];
  for(let i=0;i<this.listaEstadisticas.length;i++)
    {
      if(this.listaEstadisticas[i].perfil == "supervisor" )
        {
          if(this.listaEstadisticas[i].respuesta=="1")
            {
             this.resultado1= this.resultado1+1;
            }
          if(this.listaEstadisticas[i].respuesta=="2")
            {
             this.resultado2= this.resultado2+1;
            }
            if(this.listaEstadisticas[i].respuesta=="3")
              {
               this.resultado3= this.resultado3+1;
              }
        }
    }
    console.log(this.listaEstadisticas);
    this.aData=[this.resultado1,this.resultado2,this.resultado3];
}



  closeModal() {
    
    this.viewCtrl.dismiss();
  }

  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
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
