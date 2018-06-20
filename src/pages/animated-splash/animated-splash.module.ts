import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnimatedSplashPage } from './animated-splash';

@NgModule({
  declarations: [
    AnimatedSplashPage
  ],
  imports: [
    IonicPageModule.forChild(AnimatedSplashPage),
  ],
})
export class AnimatedSplashPageModule {}
