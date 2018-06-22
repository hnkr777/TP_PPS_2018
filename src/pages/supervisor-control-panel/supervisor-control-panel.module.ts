import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SuperControlPanelPage } from './supervisor-control-panel';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    //SuperControlPanelPage,
  ],
  imports: [
    IonicPageModule.forChild(SuperControlPanelPage),
    TranslateModule.forChild()
  ],
})
export class SuperControlPanelPageModule {}
