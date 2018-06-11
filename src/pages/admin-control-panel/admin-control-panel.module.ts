import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminControlPanelPage } from './admin-control-panel';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    //AdminControlPanelPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminControlPanelPage),
    TranslateModule.forChild()
  ],
})
export class AdminControlPanelPageModule {}
