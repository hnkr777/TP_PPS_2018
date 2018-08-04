import { Directive, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ThemeProvider } from '../../providers/theme/theme';
import { CustomProvider } from '../../providers/custom/custom';

/**
 * Generated class for the ThemeHeaderDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[theme-header]' // Attribute selector
})
export class ThemeHeaderDirective implements OnInit, OnDestroy {
  subs : Subscription;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private themes: ThemeProvider,
    private custom: CustomProvider
  ) {
    //background: linear-gradient(#3be7ff, yellow, #3be7ff);
  }

  ngOnInit(): void {
    
    this.subs = this.themes.changeTheme.subscribe(theme => {
      this.setStyles();
    })
  }

  ngOnDestroy(): void {
    this.subs && this.subs.unsubscribe();
  }

  setStyles() {
    this.removeClass();
    //this.renderer.setStyle(this.el.nativeElement.firstChild, 'cssText', ' ');
    if(this.themes.isCustom()) {
      console.log('Custom header!!!');
      let c = this.custom.getCustomConfig();
      // this.renderer.setStyle(this.el.nativeElement.firstChild, 'background', 'linear-gradient(' + c.color + ', white, ' + c.color + ')');
      this.renderer.setAttribute(this.el.nativeElement, 'style', 'background-color: '+ c.backgroundColor + ' !important;');
    } 
  }

  removeClass() {
    
  }
}
