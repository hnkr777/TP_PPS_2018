import { Directive, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ThemeProvider, Themes } from '../../providers/theme/theme';
import { CustomProvider } from '../../providers/custom/custom';

/**
 * Generated class for the TemaGeneralDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[theme-bg]' // Attribute selector
})
export class ThemeBgDirective implements OnInit, OnDestroy {

  subs : Subscription;

  constructor(private el : ElementRef, private themes : ThemeProvider, private renderer : Renderer2, private custom : CustomProvider) {
    console.warn('tema-general iniciado');
  }

  ngOnInit() {
    
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

    //this.renderer.addClass(this.el.nativeElement, 'background-img');
    if(currentTheme == Themes.argentina) {
      // this.renderer.setStyle(this.el.nativeElement, 'background', 'url("/assets/imgs/bg/a2.jpg")');
      // this.renderer.setStyle(this.el.nativeElement, 'backgroundPosition', 'bottom');
      // this.renderer.setStyle(this.el.nativeElement, 'backgroundSize', 'cover');
    } else if (currentTheme == Themes.professional) {
      console.log('ES PROFESSIONAL!!!!!!!!!!');
      // this.renderer.setStyle(this.el.nativeElement, 'background', 'url(assets/imgs/bg/g2.jpg)');
      // this.renderer.setStyle(this.el.nativeElement, 'backgroundPosition', 'bottom');
      // this.renderer.setStyle(this.el.nativeElement, 'backgroundSize', 'cover');
    } else if (currentTheme == Themes.naif) {
      // this.renderer.setStyle(this.el.nativeElement, 'background', 'url(assets/imgs/bg/n1.jpg)');
      // this.renderer.setStyle(this.el.nativeElement, 'backgroundPosition', 'bottom');
      // this.renderer.setStyle(this.el.nativeElement, 'backgroundSize', 'cover');
    } else if (currentTheme == Themes.custom) {
      console.log('ES CUSTOM!!!!!!!!!!');
      let c = this.custom.getCustomConfig();
      console.log('FOTO: '+c.foto);
      if(c.foto !== undefined) {
        this.renderer.setAttribute(this.el.nativeElement,'style', 'background-size: cover;');
        this.renderer.setAttribute(this.el.nativeElement,'style', 'background-repeat: repeat;');
        this.renderer.setAttribute(this.el.nativeElement,'style', 'background-image: url(\''+ c.foto +'\');');
      } else {
        this.renderer.setAttribute(this.el.nativeElement,'style', 'background-color: '+ c.backgroundColor + ' ');
      }
      
      //this.renderer.setStyle(this.el.nativeElement, 'backgroundPosition', 'bottom');
      //this.renderer.setStyle(this.el.nativeElement, 'backgroundSize', 'cover ');
      // this.renderer.setAttribute(this.el.nativeElement,'style', 'background-position: cover ');
    } else {
      console.log('FALLA!!!!!!!!!!');
    }
  }

  removeClass() {
    //this.renderer.removeClass(this.el.nativeElement, 'background-img');
    this.renderer.removeClass(this.el.nativeElement, 'content-md');
  }
}
