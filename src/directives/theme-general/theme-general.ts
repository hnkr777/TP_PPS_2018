import { Directive, ElementRef, Renderer2, OnDestroy, OnInit } from '@angular/core';
import { ThemeProvider } from '../../providers/theme/theme';
import { Subscription } from 'rxjs/Subscription';
import { CustomProvider } from '../../providers/custom/custom';

/**
 * Generated class for the ThemeGeneralDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[theme-general]' // Attribute selector
})
export class ThemeGeneralDirective implements OnInit, OnDestroy {

  subs : Subscription;

  constructor(private el : ElementRef, private renderer : Renderer2, private themes : ThemeProvider, private custom : CustomProvider) {
    
  }


  ngOnInit(): void {
    console.log(this.themes.changeTheme);
    this.subs = this.themes.changeTheme.subscribe(theme => {
      this.setStyles();
    })
  }

  ngOnDestroy(): void {
    this.subs && this.subs.unsubscribe();
  }

  setStyles() {
    this.removeClass();
    if(this.themes.isArgentina()) {
      this.renderer.addClass(this.el.nativeElement, 'theme-argentina');
    } else if (this.themes.isProfesional()) {
      this.renderer.addClass(this.el.nativeElement, 'theme-professional');
    } else if (this.themes.isNaif()) {
      this.renderer.addClass(this.el.nativeElement, 'theme-naif');
    } else {
      let c = this.custom.getCustomConfig();
      this.renderer.addClass(this.el.nativeElement, c.fontCss);
    }
  }

  removeClass() {
    this.renderer.removeClass(this.el.nativeElement, 'theme-argentina');
    this.renderer.removeClass(this.el.nativeElement, 'theme-profesional');
    this.renderer.removeClass(this.el.nativeElement, 'theme-naif');
    this.renderer.removeClass(this.el.nativeElement, 'theme-Wendy-One');
    this.renderer.removeClass(this.el.nativeElement, 'fuente-shrikhand');
    this.renderer.removeClass(this.el.nativeElement, 'fuente-Montserrat');

  }
}
