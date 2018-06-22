import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisorViajesPage } from './visor-viajes';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    VisorViajesPage
  ],
  imports: [
    IonicPageModule.forChild(VisorViajesPage),
    TranslateModule.forChild()
  ],
})
export class VisorViajesPageModule {}
