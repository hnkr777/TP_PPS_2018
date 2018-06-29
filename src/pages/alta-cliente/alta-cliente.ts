import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, ModalController, ActionSheetController,NavParams,AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { storage, firestore } from 'firebase';
import * as firebase from 'firebase';
import { LoginPage } from "../../pages/login/login";
import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";

/**
 * Generated class for the AltaClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-cliente',
  templateUrl: 'alta-cliente.html',
})
export class AltaClientePage {
  unCliente;
  public base64Image : string;
  private spinner;
  coleccionTipadaFirebase:AngularFirestoreCollection<any>;
  ListadoUsuariosObservable: Observable<any[]>;
  fechaAlta;

  constructor(public navCtrl: NavController, public navParams: NavParams,private builder: FormBuilder,private camera: Camera,public alertCtrl: AlertController,private objFirebase: AngularFirestore,public modalCtrl: ModalController) {
    this.unCliente=new Object();
    this.unCliente.foto=null;
    this.fechaAlta = new Date(Date.now());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaClientePage');
  }

nombre : FormControl = new FormControl("",[Validators.required]);
apellido : FormControl = new FormControl("",[Validators.required]);
correo : FormControl = new FormControl("",[Validators.required,Validators.email]);
clave : FormControl = new FormControl("",[Validators.required]);
claveRep : FormControl = new FormControl("",[Validators.required]);
dni : FormControl = new FormControl("",[Validators.required,Validators.minLength(8),Validators.maxLength(8)]);
//domicilio: FormControl = new FormControl("",[Validators.required]);
//sexo : FormControl = new FormControl("",[Validators.required]);
//fechaNacimiento : FormControl = new FormControl("",[Validators.required]);

formAlta: FormGroup= this.builder.group({
nombre:this.nombre,
apellido:this.apellido,
dni:this.dni,
correo:this.correo,
clave:this.clave,
claveRep:this.claveRep,
//domicilio:this.domicilio,
//sexo:this.sexo,
//fechaNacimiento:this.fechaNacimiento
});



guardar()
{
 
  this.unCliente.clave=this.formAlta.get("clave").value;
  let claveRep=this.formAlta.get("claveRep").value; 

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
      
  //if(this.nombre.invalid || this.apellido.invalid || this.correo.invalid || this.clave.invalid || this.claveRep.invalid || this.dni.invalid || this.domicilio.invalid || this.sexo.invalid || this.fechaNacimiento.invalid)
    if(this.nombre.invalid || this.apellido.invalid || this.correo.invalid || this.clave.invalid || this.claveRep.invalid || this.dni.invalid)
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
          if(this.clave.invalid)
            {
              this.formAlta.controls['clave'].setValue("");
              const alerta = this.alertCtrl.create({
                title: 'Error!',
                subTitle: 'Las clave no puede estar en blanco',
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

         

    
    this.spin(true);
    this.coleccionTipadaFirebase = this.objFirebase.collection<any>('usuarios');
    this.ListadoUsuariosObservable = this.coleccionTipadaFirebase.valueChanges();
    let ob= this.ListadoUsuariosObservable.subscribe(x => {
    //let id= x.length+1;
    //this.unCliente.id=id;
    this.unCliente.nombre=this.formAlta.get("nombre").value;
    this.unCliente.apellido=this.formAlta.get("apellido").value;
    this.unCliente.dni=this.formAlta.get("dni").value;
    this.unCliente.correo=this.formAlta.get("correo").value;
    this.unCliente.clave=this.formAlta.get("clave").value;
    this.unCliente.perfil="cliente";
    this.unCliente.activo=2;
    //this.unCliente.domicilio=this.formAlta.get("domicilio").value;
    //this.unCliente.sexo=this.formAlta.get("sexo").value;
    //this.unCliente.fechaNacimiento=this.formAlta.get("fechaNacimiento").value;
    this.unCliente.fechaAlta = (this.fechaAlta.getDate()+ "-" +(this.fechaAlta.getMonth() +1) + "-" +this.fechaAlta.getFullYear());
    console.log(this.unCliente);
    this.Alta(this.unCliente);
    ob.unsubscribe();
    });   
    
}

takePhoto() {
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

deletePhoto() {
this.unCliente.foto=null;
 }

 Alta(cliente)
 {
   this.objFirebase.collection<any>("usuarios").add(cliente)
   .then(ret => {
     this.spin(false);
     this.navCtrl.pop();  
     let alerta = this.alertCtrl.create({
      title: "Exitosamente!",
      subTitle: "Se enviaron los datos correctamente. Un administrador deberá activarlo",
      cssClass:"miClaseAlert",
    buttons: ['Aceptar']
  });
   alerta.present();
      
   })
   .catch( error => {
     this.spin(false);
     alert("ocurrio un error");
     console.error(error);
    // this.Modal('Error', 'Detalle: '+error);
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

 

}
