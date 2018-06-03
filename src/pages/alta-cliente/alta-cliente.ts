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

  constructor(public navCtrl: NavController, public navParams: NavParams,private builder: FormBuilder,private camera: Camera,public alertCtrl: AlertController,private objFirebase: AngularFirestore,public modalCtrl: ModalController) {
    this.unCliente=new Object();
    this.unCliente.foto=null;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AltaClientePage');
  }

nombre : FormControl = new FormControl("",[Validators.required]);
apellido : FormControl = new FormControl("",[Validators.required]);
correo : FormControl = new FormControl("",[Validators.required]);
clave : FormControl = new FormControl("",[Validators.required]);
claveRep : FormControl = new FormControl("",[Validators.required]);
dni : FormControl = new FormControl("",[Validators.required,Validators.minLength(8),Validators.maxLength(8)]);

formAlta: FormGroup= this.builder.group({
nombre:this.nombre,
apellido:this.apellido,
dni:this.dni,
correo:this.correo,
clave:this.clave,
claveRep:this.claveRep
});

guardar()
{
  this.unCliente.clave=this.formAlta.get("clave").value;
  let claveRep=this.formAlta.get("claveRep").value; 

  if(this.nombre.invalid || this.apellido.invalid || this.correo.invalid || this.clave.invalid || this.claveRep.invalid || this.dni.invalid)
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
    
    this.spin(true);
    this.coleccionTipadaFirebase = this.objFirebase.collection<any>('usuarios');
    this.ListadoUsuariosObservable = this.coleccionTipadaFirebase.valueChanges();

    let ob= this.ListadoUsuariosObservable.subscribe(x => {
    let id= x.length+1;
    this.unCliente.id=id;
    this.unCliente.nombre=this.formAlta.get("nombre").value;
    this.unCliente.apellido=this.formAlta.get("apellido").value;
    this.unCliente.dni=this.formAlta.get("dni").value;
    this.unCliente.correo=this.formAlta.get("correo").value;
    this.unCliente.clave=this.formAlta.get("clave").value;
    this.unCliente.perfil="cliente";

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
     let alerta = this.alertCtrl.create({
      title: "Exitosamente!",
      subTitle: "Se enviaron lon datos correctamente",
      cssClass:"miClaseAlert",
    buttons: ['Aceptar']
  });
   alerta.present();
     this.navCtrl.push(LoginPage);   
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
