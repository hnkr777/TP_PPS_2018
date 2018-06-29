import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController,AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup ,FormControl,Validators} from '@angular/forms';

import { environment } from "../../environments/environment";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Usuario } from "../../clases/usuario";
//import { ServicioUsuariosProvider } from '../../providers/servicio-usuarios/servicio-usuarios';
//import { ServicioFotosProvider } from '../../providers/servicio-fotos/servicio-fotos';
import { TranslateService } from '@ngx-translate/core';
import { VerImagenPage } from '../ver-imagen/ver-imagen';
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
  private activoPendiente;
correoo;
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
        this.activoPendiente=clienteaModificar.activo;
        this.formAlta.controls['nombre'].setValue(clienteaModificar.nombre);
        this.formAlta.controls['apellido'].setValue(clienteaModificar.apellido);
        //this.formAlta.controls['domicilio'].setValue(clienteaModificar.domicilio);
        this.formAlta.controls['dni'].setValue(clienteaModificar.dni);
        this.formAlta.controls['correo'].setValue(clienteaModificar.correo);
      //  this.formAlta.controls['clave'].setValue(clienteaModificar.clave);
      //  this.formAlta.controls['claveRep'].setValue(clienteaModificar.clave);
       // this.formAlta.controls['sexo'].setValue(clienteaModificar.sexo);
       // this.formAlta.controls['fechaNacimiento'].setValue(clienteaModificar.fechaNacimiento);
        if(clienteaModificar.activo==0)
          {
            this.formAlta.controls['activo'].setValue(false);
          }
          if(clienteaModificar.activo==1)
            {
              this.formAlta.controls['activo'].setValue(true);
            }
            if(clienteaModificar.activo==2)
              {
                this.formAlta.controls['activo'].setValue(false);
              }
        this.unCliente.foto=clienteaModificar.foto;
        this.unCliente.correo=clienteaModificar.correo;
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
  correo : FormControl = new FormControl("",[Validators.required,Validators.email]);
 // clave : FormControl = new FormControl("",[Validators.required]);
 // claveRep : FormControl = new FormControl("",[Validators.required]);
  dni : FormControl = new FormControl("",[Validators.required,Validators.minLength(8),Validators.maxLength(8)]);
 // domicilio: FormControl = new FormControl("",[Validators.required]);
 // sexo : FormControl = new FormControl("",[Validators.required]);
 // fechaNacimiento : FormControl = new FormControl("",[Validators.required]);
  activo : FormControl = new FormControl("",[Validators.required]);

  formAlta: FormGroup= this.builder.group({
  nombre:this.nombre,
  apellido:this.apellido,
  dni:this.dni,
  correo:this.correo,
 // clave:this.clave,
 // claveRep:this.claveRep,
 // domicilio:this.domicilio,
  //sexo:this.sexo,
  //fechaNacimiento:this.fechaNacimiento,
  activo:this.activo
  });

  accionAceptar(){
    //this.unCliente.clave=this.formAlta.get("clave").value;
    //let claveRep=this.formAlta.get("claveRep").value; 
    
   // if(this.nombre.invalid || this.apellido.invalid || this.correo.invalid || this.clave.invalid || this.claveRep.invalid || this.dni.invalid || this.domicilio.invalid || this.sexo.invalid || this.fechaNacimiento.invalid)
  let bandera=true;
   if(!this.nombre.value.match(/^[A-Za-z\_\-\.\s\xF1\xD1]+$/))
    {
      this.formAlta.controls['nombre'].setValue("");
      const alerta = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'El nombre debe contener letras',
        cssClass:"miClaseDanger",
        buttons: ['Aceptar']
      });
      alerta.present();
      return;
    }

    if(!this.apellido.value.match(/^[A-Za-z\_\-\.\s\xF1\xD1]+$/))
      {
        this.formAlta.controls['apellido'].setValue("");
        const alerta = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'El apellido debe contener letras',
          cssClass:"miClaseDanger",
          buttons: ['Aceptar']
        });
        alerta.present();
        return;
      }

      if(!this.dni.value.match(/^([0-9])*$/))
        {
          this.formAlta.controls['dni'].setValue("");
          const alerta = this.alertCtrl.create({
            title: 'Error!',
            subTitle: 'El DNI debe contener 8 dígitos',
            cssClass:"miClaseDanger",
            buttons: ['Aceptar']
          });
          alerta.present();
          return;
        }
  
   if(this.nombre.invalid || this.apellido.invalid || this.correo.invalid  || this.dni.invalid)   
   {   
     if(this.dni.invalid)
    {
      this.formAlta.controls['dni'].setValue("");
      const alerta = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'El DNI debe contener 8 dígitos',
        cssClass:"miClaseDanger",
        buttons: ['Aceptar']
      });
      alerta.present();
      return;
    }
    if(this.correo.invalid)
      {
        this.formAlta.controls['correo'].setValue("");
        const alerta = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'Formato de correo invalido',
          cssClass:"miClaseDanger",
          buttons: ['Aceptar']
        });
        alerta.present();
        return;
      }
        const alerta = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'Error en el ingreso de datos. Verifique!',
          cssClass:"miClaseDanger",
          buttons: ['Aceptar']
        });
        alerta.present();
        return;
      }
  
         /* if(this.unCliente.clave!=claveRep)
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
            }*/



  this.unCliente.nombre=this.formAlta.get("nombre").value;
  this.unCliente.apellido=this.formAlta.get("apellido").value;
  this.unCliente.dni=this.formAlta.get("dni").value;
  this.unCliente.correo=this.formAlta.get("correo").value;
  //this.unCliente.clave=this.formAlta.get("clave").value;
  this.unCliente.perfil="cliente";
 // this.unCliente.domicilio=this.formAlta.get("domicilio").value;
 // this.unCliente.sexo=this.formAlta.get("sexo").value;
  //this.unCliente.fechaNacimiento=this.formAlta.get("fechaNacimiento").value;
  this.unCliente.fechaAlta = (this.fechaAlta.getDate()+ "-" +(this.fechaAlta.getMonth() +1) + "-" +this.fechaAlta.getFullYear());
 //console.log(this.unCliente);
 this.spin(true);

 if(this.modoAlta==true)
  {      
      console.log(this.unCliente);
      this.unCliente.clave="123";
    if(this.formAlta.get("activo").value ==true)
      {
        this.unCliente.activo=1;
      }
      else
        {
          this.unCliente.activo=0;
        }

    let ob = this.servicioCliente.traerUsuarios().subscribe(data => { // la lista se va a actualizar cada vez que cambie la tabla usuarios de firebase
    //let id=data.length+1;
    //this.unCliente.id=id;
    for(let i=0;i<data.length;i++)
      {
        if(data[i].correo==this.formAlta.get("correo").value)
          {
            let alerta = this.alertCtrl.create({
              title: "Error!",
              subTitle: "El correo ya esta registrado",
              cssClass:"miClaseDanger",
            buttons: ['Aceptar']
          });
           alerta.present();
           this.formAlta.controls['correo'].setValue("");
           this.spin(false);
            //return;
            bandera=false;
          }
          
      }
      
      if(bandera==true){
    console.log(this.unCliente);
    this.nuevoCliente(this.unCliente); 
      } 
    ob.unsubscribe();
  });
        }

  if(this.modoAlta==false)
    {
      if(this.formAlta.get("activo").value ==true)
        {
          this.unCliente.activo=1;
        }
        else
          {
            if(this.activoPendiente==0){
            this.unCliente.activo=0;
            }
            if(this.activoPendiente==1){
              this.unCliente.activo=0;
              }
            if(this.activoPendiente==2){
              this.unCliente.activo=2;
              }

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

  blanquerClave()
  {
    this.spin(true);
    
    this.unCliente.clave=123;
    this.modificarclave();
  }

  modificarclave()
  {
    console.log("clienteee");
    console.log(this.unCliente);
    this.servicioCliente.modificarUsuario(this.unCliente).then(data => {
      this.spin(false);
     // this.closeModal();
      console.log('Se blanqueo la clave correctamente.');
      let alerta = this.alertCtrl.create({
        title: "Exitosamente!",
        subTitle: "Se blanqueo la clave correctamente.",
        cssClass:"miClaseAlert",
      buttons: ['Aceptar']
    });
     alerta.present();
    }).catch((error) => {
      this.spin(false);
      console.log('Error: '+ error);
      alert('Error: '+ error);
      //this.closeModal();
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

  Msg(titulo: string, mensaje: string) {
    const alerta = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      cssClass:"miClaseAlert",
      buttons: ['Aceptar']
    });
    alerta.present();
  }
  
  verImagen() {
    if (this.unCliente.foto !== undefined) {
      this.modalCtrl.create(VerImagenPage, { imagen: this.unCliente.foto}).present();
    } else {
      this.Msg('Aviso', 'Sin foto');
    }
  }
}
