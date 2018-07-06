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
import { AbmClienteProvider } from "../../providers/abm-cliente/abm-cliente";
import { InicioClientePage } from "../../pages/inicio-cliente/inicio-cliente";
import { ServicioAudioProvider } from '../../providers/servicio-audio/servicio-audio';
/**
 * Generated class for the EditarPerfilClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editar-perfil-cliente',
  templateUrl: 'editar-perfil-cliente.html',
})
export class EditarPerfilClientePage {
 unCliente;
  public base64Image : string;
  private spinner;
  coleccionTipadaFirebase:AngularFirestoreCollection<any>;
  ListadoUsuariosObservable: Observable<any[]>;


  constructor(public audioService:ServicioAudioProvider,public navCtrl: NavController, public navParams: NavParams,private builder: FormBuilder,private camera: Camera,public alertCtrl: AlertController,private objFirebase: AngularFirestore,public modalCtrl: ModalController,private servicioCliente: AbmClienteProvider) {
  // this.unCliente = this.navParams.get('cliente');
   //console.log(this.unCliente);
   this.unCliente = JSON.parse(sessionStorage.getItem('usuario'));
   this.formAlta.controls['clave'].setValue(this.unCliente.clave);
   this.formAlta.controls['claveRep'].setValue(this.unCliente.clave);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad EditarPerfilClientePage');
  }

  clave : FormControl = new FormControl("",[Validators.required]);
  claveRep : FormControl = new FormControl("",[Validators.required]);

  formAlta: FormGroup= this.builder.group({
    clave:this.clave,
    claveRep:this.claveRep,
    });


    guardar()
    {
      this.unCliente.clave=this.formAlta.get("clave").value;
      let claveRep=this.formAlta.get("claveRep").value; 

      if(this.clave.invalid)
        {
          this.formAlta.controls['clave'].setValue("");
        this.audioService.reproducirError();
        const alerta = this.alertCtrl.create({
            title: 'Error!',
            subTitle: 'Las clave no puede estar en blanco',
            cssClass:"miClaseDanger",
            buttons: ['Aceptar']
          });
          alerta.present();
          return;
        }

        if(this.unCliente.clave!=claveRep)
          {
        this.audioService.reproducirError();
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

          //alert("todo ok");
          console.log(this.unCliente);

          this.spin(true);
          this.enviar();
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


     enviar()
     {
       console.log(this.unCliente);
       
      this.servicioCliente.modificarUsuario(this.unCliente).then(data => {
        sessionStorage.setItem("usuario", JSON.stringify(this.unCliente));
        this.spin(false);
        this.navCtrl.setRoot(InicioClientePage);  
        this.audioService.reproducirExito();
        let alerta = this.alertCtrl.create({
          title: "Exitosamente!",
          subTitle: "'Se modificaron los datos correctamente",
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
