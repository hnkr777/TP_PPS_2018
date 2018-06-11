import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AbmChoferesPage } from './abm-choferes';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AbmChoferesPage
  ],
  imports: [
    IonicPageModule.forChild(AbmChoferesPage),
    TranslateModule.forChild()
  ],
})
export class AbmChoferesPageModule {}
