import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChoferPanelPage } from './chofer-panel';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    //ChoferPanelPage,
  ],
  imports: [
    IonicPageModule.forChild(ChoferPanelPage),
    TranslateModule.forChild()
  ],
})
export class ChoferPanelPagePageModule {}
