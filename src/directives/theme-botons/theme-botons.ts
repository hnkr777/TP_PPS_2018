import { Directive, ElementRef, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { ThemeProvider, Themes } from '../../providers/theme/theme';
import { Subscription } from 'rxjs/Subscription';
import { CustomProvider } from '../../providers/custom/custom';

/**
 * Generated class for the ThemeBotonsDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[theme-botons]' // Attribute selector
})
export class ThemeBotonsDirective implements OnInit, OnDestroy {

  subs : Subscription;

  constructor(
    private el: ElementRef, 
    private themes: ThemeProvider, 
    private renderer: Renderer2, 
    private custom: CustomProvider
  ) {
    
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
    let currentTheme: Themes;
    
    if(localStorage.getItem('tema')) {
      currentTheme = localStorage.getItem('tema') as Themes;
    }

    //this.renderer.setStyle(this.el.nativeElement, 'cssText', ' ');

    if(currentTheme == Themes.argentina) {
      
      this.renderer.addClass(this.el.nativeElement, 'button-outline');
      this.renderer.addClass(this.el.nativeElement, 'button-outline-md');
      
    } else if (currentTheme == Themes.professional) {
      
      this.renderer.addClass(this.el.nativeElement, 'button-full');
      this.renderer.addClass(this.el.nativeElement, 'button-full-md');
    } else if (currentTheme == Themes.naif) {
      console.log('botons is NAIF!!!!!!!!');
      this.renderer.addClass(this.el.nativeElement, 'button-large');
      this.renderer.addClass(this.el.nativeElement, 'button-large-md');
    } else if(currentTheme == Themes.custom && localStorage.getItem('tema')=='custom') {
      console.log('botons is CUSTOM!!!!!!!!');
      let c = this.custom.getCustomConfig();
      this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', c.bgBotton);
      this.renderer.setStyle(this.el.nativeElement, 'borderRadius', c.borderRadius);
      this.renderer.setStyle(this.el.nativeElement, 'color', c.textColor);
      this.renderer.setStyle(this.el.nativeElement, 'fontWeight', c.fontWeight);
      this.renderer.setStyle(this.el.nativeElement, 'textTransform', c.textTransform);
    }
  }

  removeClass() {
    this.renderer.removeClass(this.el.nativeElement, 'button-outline');
    this.renderer.removeClass(this.el.nativeElement, 'button-full-md');
    this.renderer.removeClass(this.el.nativeElement, 'button-full');
    this.renderer.removeClass(this.el.nativeElement, 'button-outline-md');
    this.renderer.removeClass(this.el.nativeElement, 'button-large');
    this.renderer.removeClass(this.el.nativeElement, 'button-large-md');
    this.renderer.removeStyle(this.el.nativeElement, 'color');
    this.renderer.removeStyle(this.el.nativeElement, 'background-color');
  }
}
