import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {APP_INITIALIZER} from '@angular/core';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {BackgroundComponent} from './background/background.component';
import {ContentComponent} from './content/content.component';
import {ClockComponent} from './content/clock/clock.component';

import {ConfigService} from './shared/services/config.service';
import {ClockService} from './shared/services/clock.service';

import {environment} from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    BackgroundComponent,
    ContentComponent,
    ClockComponent
  ],
  imports: [
    HttpModule,
    BrowserModule
  ],
  providers: [ConfigService, {
    provide: APP_INITIALIZER,
    useFactory: ConfigLoader,
    deps: [ConfigService],
    multi: true
  },
    // Add more services here:
    ClockService],
  bootstrap: [AppComponent],
})

export class AppModule {
}

// Function needed to load config.json parameters before application startup.
export function ConfigLoader(configService: ConfigService) {
// Note: this factory need to return a function (that returns a promise)
  return () => configService.load(environment.configFile);
}
