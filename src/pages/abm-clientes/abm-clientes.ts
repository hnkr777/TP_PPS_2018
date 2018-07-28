import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AbmClienteProvider } from "../../providers/abm-cliente/abm-cliente";
import { Usuario } from '../../clases/usuario';
import { AltaClienteParaAdminPage } from '../../pages/alta-cliente-para-admin/alta-cliente-para-admin';
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";
import { ServicioAudioProvider } from "../../providers/servicio-audio/servicio-audio";
import { MostrarImgPage } from '../mostrar-img/mostrar-img';
import { InAppBrowser } from '../../../node_modules/@ionic-native/in-app-browser';
/**
 * Generated class for the AbmClientesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-abm-clientes',
  templateUrl: 'abm-clientes.html',
})
export class AbmClientesPage {


public listaClientes: any[];
public auxListaClientes: any[];
 private unCliente;
 private spinner;
 private mostrar;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private servicioCliente: AbmClienteProvider,
    public modalCtrl: ModalController,
    public audioService:ServicioAudioProvider,
    public inab:InAppBrowser
  ) {
  }

  ionViewDidLoad() {
    this.spin(true);
    let usuarios: any;
    this.mostrar="todos";
    let ob = this.servicioCliente.traerUsuariosPorPerfil('cliente').subscribe(data => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
  
      this.listaClientes = data;
      this.auxListaClientes=data;

     /* if(this.mostrar=="pendientes")
        {
        this.mostrarPendientes();
        }

        if(this.mostrar=="suspendidos")
          {
          this.mostrarSuspendidos();
          }*/
          this.filtrarViajes()

        
      this.spin(false);

    });
  }

  nuevoCliente() {
    this.modalCtrl.create(AltaClienteParaAdminPage).present();
    
  }

  modificar($event) {
    this.unCliente = $event;
    console.log(this.unCliente);
    this.modalCtrl.create(AltaClienteParaAdminPage, {cliente: this.unCliente}).present();
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


   filtrarViajes()
   {
     if(this.mostrar=="todos")
      {
        this.mostrarTodos();
      }

      if(this.mostrar=="pendientes")
        {
          this.mostrarPendientes();
        }
        if(this.mostrar=="suspendidos")
          {
            this.mostrarSuspendidos();
          }

          if(this.mostrar=="activos")
            {
              this.mostrarActivos();
            }
   }
   private mostrarPendientes()
   {
    this.mostrar="pendientes";
    this.listaClientes=[];
    console.log(this.auxListaClientes);
    for(let i=0;i<this.auxListaClientes.length;i++)
      {
        if(this.auxListaClientes[i].activo==2)
          {
            this.listaClientes.push(this.auxListaClientes[i]);
            
          }
      }
   }

   private mostrarSuspendidos()
   {
    this.mostrar="suspendidos";
    this.listaClientes=[];
    console.log(this.auxListaClientes);
    for(let i=0;i<this.auxListaClientes.length;i++)
      {
        if(this.auxListaClientes[i].activo==0)
          {
            this.listaClientes.push(this.auxListaClientes[i]);
            
          }
      }
   }

   private mostrarActivos()
   {
    this.mostrar="activos";
    this.listaClientes=[];
    console.log(this.auxListaClientes);
    for(let i=0;i<this.auxListaClientes.length;i++)
      {
        if(this.auxListaClientes[i].activo==1)
          {
            this.listaClientes.push(this.auxListaClientes[i]);
            
          }
      }
   }

   private mostrarTodos()
   {
    this.listaClientes=[];
 this.listaClientes=this.auxListaClientes;
   }
   
  goLinkApidoc(){
    this.inab.create("http://juanmurciautn.hol.es/DocApiDoc/");
  }
  goLinkCompoDoc(){
    this.inab.create("http://juanmurciautn.hol.es/DocCompoDoc/");
  }
  goMostrar(){
    this.navCtrl.push(MostrarImgPage,{img:"TutoABMClientes",gif:false});
  }
}
