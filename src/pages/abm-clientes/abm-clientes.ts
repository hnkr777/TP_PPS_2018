import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AbmClienteProvider } from "../../providers/abm-cliente/abm-cliente";
import { Usuario } from '../../clases/usuario';
import { AltaClienteParaAdminPage } from '../../pages/alta-cliente-para-admin/alta-cliente-para-admin';


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


  public listaClientes: any;
 private unCliente;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private servicioCliente: AbmClienteProvider,
    public modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
    let usuarios: any;
    let ob = this.servicioCliente.traerUsuariosPorPerfil('cliente').subscribe(data => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
      //console.log('data: ' + JSON.stringify(data));
      this.listaClientes = data;
      //console.log(this.listaClientes);
      //ob.unsubscribe();
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

}
