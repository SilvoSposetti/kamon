import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {environment} from '../environments/environment';
import {FormsModule} from '@angular/forms';
import {HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// App components
import {AppComponent} from './app.component';
import {BackgroundComponent} from './background/background.component';
import {ContentComponent} from './content/content.component';
import {MenuWindowComponent} from './content/menu-window/menu-window.component';
import {ClockComponent} from './content/clock/clock.component';
import {SettingComponent} from './background/setting/setting.component';
import {SceneComponent} from './background/scene/scene.component';
import {FpsComponent} from './background/fps/fps.component';
import {ShortcutListComponent} from './content/menu-window/shortcut-list/shortcut-list.component';
import {DefaultMenuComponent} from './content/menu-window/default-menu/default-menu.component';
import {HowToComponent} from './content/menu-window/how-to/how-to.component';
import {AboutComponent} from './content/menu-window/about/about.component';
import {SceneSelectorComponent} from './content/menu-window/scene-selector/scene-selector.component';
// Scenes:
import {AsteroidsComponent} from './background/scene/asteroids/asteroids.component';
import {PhyllotaxyComponent} from './background/scene/phyllotaxy/phyllotaxy.component';
import {MazeComponent} from './background/scene/maze/maze.component';
import {PerlinFieldComponent} from './background/scene/perlin-field/perlin-field.component';
import {RainComponent} from './background/scene/rain/rain.component';
import {LissajousComponent} from './background/scene/lissajous/lissajous.component';
import {HarmonicFunctionsComponent} from './background/scene/harmonic-functions/harmonic-functions.component';
import {TreeMapComponent} from './background/scene/tree-map/tree-map.component';
import {SortingAlgorithmsComponent} from './background/scene/sorting-algorithms/sorting-algorithms.component';
import {BoidsComponent} from './background/scene/boids/boids.component';
import {InfiniteZoomComponent} from './background/scene/infinite-zoom/infinite-zoom.component';
import {ModularMultiplicationComponent} from './background/scene/modular-multiplication/modular-multiplication.component';
import {DropsComponent} from './background/scene/drops/drops.component';
import {DiffusionLimitedAggregationComponent} from './background/scene/diffusion-limited-aggregation/diffusion-limited-aggregation.component';
import {GameOfLifeComponent} from './background/scene/game-of-life/game-of-life.component';
import {KaleidoscopeComponent} from './background/scene/kaleidoscope/kaleidoscope.component';
import {PolarFunctionsComponent} from './background/scene/polar-functions/polar-functions.component';
import {LangtonsAntComponent} from './background/scene/langtons-ant/langtons-ant.component';
import {QuadTreeComponent} from './background/scene/quad-tree/quad-tree.component';
import {PlexusComponent} from './background/scene/plexus/plexus.component';
import {RefractionComponent} from './background/scene/refraction/refraction.component';
import {ParallaxComponent} from './background/scene/parallax/parallax.component';
import {VisualClockComponent} from './background/scene/visual-clock/visual-clock.component';
import {HexagonsComponent} from './background/scene/hexagons/hexagons.component';
import {RecursiveTreeComponent} from './background/scene/recursive-tree/recursive-tree.component';
import {StackedPlotComponent} from './background/scene/stacked-plot/stacked-plot.component';
// Directives:
import {MyFocusDirective} from './shared/directives/my-focus.directive';
import {MyBlinkDirective} from './shared/directives/my-blink.directive';
// Services:
import {ConfigService} from './shared/services/config.service';
import {ClockService} from './shared/services/clock.service';
import {ScreenSizeService} from './shared/services/screen-size.service';
import {SearchComponent} from './content/search/search.component';
import {SearchService} from './shared/services/search.service';
import {ScenesService} from './shared/services/scenes.service';
import {LocationService} from './shared/services/location.service';
import {ToDoService} from './shared/services/to-do.service';
import {FpsService} from './shared/services/fps.service';
import {ColorService} from './shared/services/color.service';



@NgModule({
  declarations: [
    AppComponent,
    BackgroundComponent,
    ContentComponent,
    ClockComponent,
    SettingComponent,
    SceneComponent,
    SearchComponent,
    MyFocusDirective,
    ShortcutListComponent,
    DefaultMenuComponent,
    HowToComponent,
    AboutComponent,
    AsteroidsComponent,
    PhyllotaxyComponent,
    SceneSelectorComponent,
    MazeComponent,
    PerlinFieldComponent,
    RainComponent,
    LissajousComponent,
    HarmonicFunctionsComponent,
    MyBlinkDirective,
    TreeMapComponent,
    SortingAlgorithmsComponent,
    BoidsComponent,
    InfiniteZoomComponent,
    ModularMultiplicationComponent,
    DropsComponent,
    DiffusionLimitedAggregationComponent,
    GameOfLifeComponent,
    KaleidoscopeComponent,
    PolarFunctionsComponent,
    LangtonsAntComponent,
    QuadTreeComponent,
    PlexusComponent,
    FpsComponent,
    RefractionComponent,
    ParallaxComponent,
    VisualClockComponent,
    HexagonsComponent,
    RecursiveTreeComponent,
    StackedPlotComponent,
    MenuWindowComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserAnimationsModule
  ],
  providers: [ConfigService, {
    provide: APP_INITIALIZER,
    useFactory: ConfigLoader,
    deps: [ConfigService],
    multi: true
  },
    // Add more services here:
    ClockService,
    ScreenSizeService,
    SearchService,
    ScenesService,
    LocationService,
    ToDoService,
    FpsService,
    ColorService],
  bootstrap: [AppComponent],
})

export class AppModule {
}

// Function needed to load config.json parameters before application startup.
export function ConfigLoader(configService: ConfigService) {
// Note: this factory need to return a function (that returns a promise)
  return () => configService.load(environment.configFile);
}
