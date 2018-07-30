import { NgModule } from '@angular/core';
import { BotonesDirective } from './botones/botones';
import { ThemeBotonsDirective } from './theme-botons/theme-botons';
import { ThemeHeaderDirective } from './theme-header/theme-header';
import { ThemeContentDirective } from './theme-content/theme-content';
import { ThemeGeneralDirective } from './theme-general/theme-general';
import { ThemeBgDirective } from './theme-bg/theme-bg';
@NgModule({
	declarations: [BotonesDirective,
    ThemeBotonsDirective,
    ThemeHeaderDirective,
    ThemeContentDirective,
    ThemeGeneralDirective,
    ThemeBgDirective],
	imports: [],
	exports: [BotonesDirective,
    ThemeBotonsDirective,
    ThemeHeaderDirective,
    ThemeContentDirective,
    ThemeGeneralDirective,
    ThemeBgDirective]
})
export class DirectivesModule {}
