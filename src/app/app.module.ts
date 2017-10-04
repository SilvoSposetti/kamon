import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {environment} from '../environments/environment';
import {FormsModule} from '@angular/forms';

import {APP_INITIALIZER} from '@angular/core';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {BackgroundComponent} from './background/background.component';
import {ContentComponent} from './content/content.component';
import {ClockComponent} from './content/clock/clock.component';
import {SettingComponent} from './background/setting/setting.component';
import {SceneComponent} from './background/scene/scene.component';
import {ListComponent} from './content/list/list.component';

import {ConfigService} from './shared/services/config.service';
import {ClockService} from './shared/services/clock.service';
import {ScreenSizeService} from './shared/services/screen-size.service';
import {SearchComponent} from './content/search/search.component';
import {MyFocusDirective} from './shared/directives/my-focus.directive';



@NgModule({
  declarations: [
    AppComponent,
    BackgroundComponent,
    ContentComponent,
    ClockComponent,
    SettingComponent,
    SceneComponent,
    ListComponent,
    SearchComponent,
    MyFocusDirective
  ],
  imports: [
    HttpModule,
    BrowserModule,
    FormsModule
  ],
  providers: [ConfigService, {
    provide: APP_INITIALIZER,
    useFactory: ConfigLoader,
    deps: [ConfigService],
    multi: true
  },
    // Add more services here:
    ClockService, ScreenSizeService],
  bootstrap: [AppComponent],
})

export class AppModule {
}

// Function needed to load config.json parameters before application startup.
export function ConfigLoader(configService: ConfigService) {
// Note: this factory need to return a function (that returns a promise)
  return () => configService.load(environment.configFile);
}
