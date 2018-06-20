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
/**
 * Generated class for the AltaClienteParaAdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-cliente-para-admin',
  templateUrl: 'alta-cliente-para-admin.html',
})
export class AltaClienteParaAdminPage {
  unCliente;
  fechaAlta;
  private spinner;
  base64Image: string;
  modoAlta;

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
    private servicioCliente: AbmClienteProvider
    //private objFirebase: AngularFirestore
  ) {
    this.unCliente=new Object();
    let clienteaModificar = navParams.get('cliente');
    if(clienteaModificar !== undefined)
      {
        this.modoAlta = false;
        this.fechaAlta = new Date(Date.now());
        this.formAlta.controls['nombre'].setValue(clienteaModificar.nombre);
        this.formAlta.controls['apellido'].setValue(clienteaModificar.apellido);
        this.formAlta.controls['domicilio'].setValue(clienteaModificar.domicilio);
        this.formAlta.controls['dni'].setValue(clienteaModificar.dni);
        this.formAlta.controls['correo'].setValue(clienteaModificar.correo);
        this.formAlta.controls['clave'].setValue(clienteaModificar.clave);
        this.formAlta.controls['claveRep'].setValue(clienteaModificar.clave);
        this.formAlta.controls['sexo'].setValue(clienteaModificar.sexo);
        this.formAlta.controls['fechaNacimiento'].setValue(clienteaModificar.fechaNacimiento);
        this.formAlta.controls['activo'].setValue(clienteaModificar.activo);
        this.unCliente.foto=clienteaModificar.foto;
        this.unCliente.id=clienteaModificar.id;
      }
      else
        {
          this.modoAlta = true;
          this.unCliente.foto=null;
          this.fechaAlta = new Date(Date.now());
          this.formAlta.controls['activo'].setValue(true);
        }
    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaClienteParaAdminPage');
  }

  nombre : FormControl = new FormControl("",[Validators.required]);
  apellido : FormControl = new FormControl("",[Validators.required]);
  correo : FormControl = new FormControl("",[Validators.required]);
  clave : FormControl = new FormControl("",[Validators.required]);
  claveRep : FormControl = new FormControl("",[Validators.required]);
  dni : FormControl = new FormControl("",[Validators.required,Validators.minLength(8),Validators.maxLength(8)]);
  domicilio: FormControl = new FormControl("",[Validators.required]);
  sexo : FormControl = new FormControl("",[Validators.required]);
  fechaNacimiento : FormControl = new FormControl("",[Validators.required]);
  activo : FormControl = new FormControl("",[Validators.required]);

  formAlta: FormGroup= this.builder.group({
  nombre:this.nombre,
  apellido:this.apellido,
  dni:this.dni,
  correo:this.correo,
  clave:this.clave,
  claveRep:this.claveRep,
  domicilio:this.domicilio,
  sexo:this.sexo,
  fechaNacimiento:this.fechaNacimiento,
  activo:this.activo
  });

  accionAceptar(){
    this.unCliente.clave=this.formAlta.get("clave").value;
    let claveRep=this.formAlta.get("claveRep").value; 
  
    if(this.nombre.invalid || this.apellido.invalid || this.correo.invalid || this.clave.invalid || this.claveRep.invalid || this.dni.invalid || this.domicilio.invalid || this.sexo.invalid || this.fechaNacimiento.invalid)
      {
        const alerta = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'Error en el ingreso de datos. Verifique!',
          cssClass:"miClaseDanger",
          buttons: ['Aceptar']
        });
        alerta.present();
        return;
      }
  
          if(this.unCliente.clave!=claveRep)
            {
              const alerta = this.alertCtrl.create({
                title: 'Error!',
                subTitle: 'Las claves no coinciden. Reingrese!',
                cssClass:"miClaseDanger",
                buttons: ['Aceptar']
              });
              alerta.present();
              this.formAlta.controls['clave'].setValue("");
              this.formAlta.controls['claveRep'].setValue("");
              return;
            }



  this.unCliente.nombre=this.formAlta.get("nombre").value;
  this.unCliente.apellido=this.formAlta.get("apellido").value;
  this.unCliente.dni=this.formAlta.get("dni").value;
  this.unCliente.correo=this.formAlta.get("correo").value;
  this.unCliente.clave=this.formAlta.get("clave").value;
  this.unCliente.perfil="cliente";
  this.unCliente.domicilio=this.formAlta.get("domicilio").value;
  this.unCliente.sexo=this.formAlta.get("sexo").value;
  this.unCliente.fechaNacimiento=this.formAlta.get("fechaNacimiento").value;
  this.unCliente.fechaAlta = (this.fechaAlta.getDate()+ "-" +(this.fechaAlta.getMonth() +1) + "-" +this.fechaAlta.getFullYear());
 //console.log(this.unCliente);
 this.spin(true);

 if(this.modoAlta==true)
  {      
      console.log(this.unCliente);
    if(this.formAlta.get("activo").value ==true)
      {
        this.unCliente.activo=1;
      }
      else
        {
          this.unCliente.activo=0;
        }

    let ob = this.servicioCliente.traerUsuarios().subscribe(data => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
    let id=data.length+1;
    this.unCliente.id=id;
    console.log(this.unCliente);
    this.nuevoCliente(this.unCliente);  
    ob.unsubscribe();
  });
        }

  if(this.modoAlta==false)
    {
      if(this.formAlta.get("activo").value ==true || this.formAlta.get("activo").value ==1)
        {
          this.unCliente.activo=1;
        }
        else
          {
            this.unCliente.activo=0;
          }
//console.log(this.unCliente);
this.modificarCliente();

    }


  }

  nuevoCliente(cliente:any) {
    this.servicioCliente.guardarNuevoCliente(cliente).then(data => {
      this.spin(false);
      this.closeModal();
      let alerta = this.alertCtrl.create({
        title: "Exitosamente!",
        subTitle: "Se enviaron los datos correctamente.",
        cssClass:"miClaseAlert",
      buttons: ['Aceptar']
    });
     alerta.present();
    }).catch((error) => {
      console.log('Error: '+ error);
      alert('Error: '+ error);
    });
  }

  modificarCliente() {
    this.servicioCliente.modificarUsuario(this.unCliente).then(data => {
      this.spin(false);
      this.closeModal();
      console.log('Cliente guardado correctamente.');
      let alerta = this.alertCtrl.create({
        title: "Exitosamente!",
        subTitle: "Se modificaron los datos correctamente.",
        cssClass:"miClaseAlert",
      buttons: ['Aceptar']
    });
     alerta.present();
    }).catch((error) => {
      console.log('Error: '+ error);
      alert('Error: '+ error);
      this.closeModal();
    });
  }


  tomarFoto()
  {
    const options : CameraOptions = {
      quality: 50,
    //  destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.DATA_URL,
    }
    this
      .camera
      .getPicture(options)
      .then((imageData) => {
        this.base64Image =  `data:image/jpeg;base64,${imageData}`;
        this.unCliente.foto=this.base64Image;
      }, (err) => {
        console.log(err);
      });
  }

  cargarFoto()
  {
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: 0,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }
    this
    .camera
    .getPicture(options)
    .then((imageData) => {
      this.base64Image =  `data:image/jpeg;base64,${imageData}`;
      this.unCliente.foto=this.base64Image;
    }, (err) => {
      console.log(err);
    });

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

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
