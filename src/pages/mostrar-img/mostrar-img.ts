import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MostrarImgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mostrar-img',
  templateUrl: 'mostrar-img.html',
})
export class MostrarImgPage {
  
  imgName:string;
  images;
  gifOn:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
   this.imgName =  this.navParams.get('img');
   this.gifOn =  this.navParams.get('gif');
   if (this.gifOn) {
      this.images = [{
        url:"./assets/Tutos/"+this.imgName+".jpg"
      },
      {
        url:"./assets/Tutos/"+this.imgName+".gif"
      }
    ]
   }
   else{
    this.images = [{
      url:"./assets/Tutos/"+this.imgName+".jpg"
    }]
   }
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MostrarImgPage');
  }
  goBack(){
    this.navCtrl.pop();
  }
}
