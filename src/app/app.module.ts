import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {environment} from '../environments/environment';
import {FormsModule} from '@angular/forms';

import {APP_INITIALIZER} from '@angular/core';
import {HttpModule} from '@angular/http';
import {JsonpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// App components
import {AppComponent} from './app.component';
import {BackgroundComponent} from './background/background.component';
import {ContentComponent} from './content/content.component';
import {ClockComponent} from './content/clock/clock.component';
import {SettingComponent} from './background/setting/setting.component';
import {SceneComponent} from './background/scene/scene.component';
import {ListComponent} from './content/list/list.component';
import {FuckOffComponent} from './content/fuck-off/fuck-off.component';

// Scenes:
import {AsteroidsComponent} from './background/scene/asteroids/asteroids.component';
import {PhyllotaxyComponent} from './background/scene/phyllotaxy/phyllotaxy.component';
import {SceneSelectorComponent} from './content/scene-selector/scene-selector.component';
import {MazeComponent} from './background/scene/maze/maze.component';
import {PerlinFieldComponent} from './background/scene/perlin-field/perlin-field.component';
import {RainComponent} from './background/scene/rain/rain.component';
import {LissajousComponent} from './background/scene/lissajous/lissajous.component';
import {FunctionsComponent} from './background/scene/functions/functions.component';
import {HarmonicFunctionsComponent} from './background/scene/harmonic-functions/harmonic-functions.component';
import {TreeMapComponent} from './background/scene/tree-map/tree-map.component';
import {SortingAlgorithmsComponent} from './background/scene/sorting-algorithms/sorting-algorithms.component';
import {BoidsComponent} from './background/scene/boids/boids.component';
import {VoronoiComponent} from './background/scene/voronoi/voronoi.component';
import {InfiniteZoomComponent} from './background/scene/infinite-zoom/infinite-zoom.component';

// Directives:
import {MyFocusDirective} from './shared/directives/my-focus.directive';
import {MyBlinkDirective} from './shared/directives/my-blink.directive';

// Services:
import {ConfigService} from './shared/services/config.service';
import {ClockService} from './shared/services/clock.service';
import {ScreenSizeService} from './shared/services/screen-size.service';
import {SearchComponent} from './content/search/search.component';
import {SearchService} from './shared/services/search.service';
import {FuckOffService} from './shared/services/fuck-off.service';
import {ScenesService} from './shared/services/scenes.service';
import {LocationService} from './shared/services/location.service';
import { ModularMultiplicationComponent } from './background/scene/modular-multiplication/modular-multiplication.component';




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
    MyFocusDirective,
    FuckOffComponent,
    AsteroidsComponent,
    PhyllotaxyComponent,
    SceneSelectorComponent,
    MazeComponent,
    PerlinFieldComponent,
    RainComponent,
    LissajousComponent,
    FunctionsComponent,
    HarmonicFunctionsComponent,
    MyBlinkDirective,
    TreeMapComponent,
    SortingAlgorithmsComponent,
    BoidsComponent,
    VoronoiComponent,
    InfiniteZoomComponent,
    ModularMultiplicationComponent],
  imports: [
    HttpModule,
    BrowserModule,
    FormsModule,
    JsonpModule,
    BrowserAnimationsModule
  ],
  providers: [ConfigService, {
    provide: APP_INITIALIZER,
    useFactory: ConfigLoader,
    deps: [ConfigService],
    multi: true
  },
    // Add more services here:
    ClockService, ScreenSizeService, SearchService, FuckOffService, ScenesService, LocationService],
  bootstrap: [AppComponent],
})

export class AppModule {
}

// Function needed to load config.json parameters before application startup.
export function ConfigLoader(configService: ConfigService) {
// Note: this factory need to return a function (that returns a promise)
  return () => configService.load(environment.configFile);
}
