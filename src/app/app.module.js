"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var environment_1 = require("../environments/environment");
var forms_1 = require("@angular/forms");
var core_2 = require("@angular/core");
var http_1 = require("@angular/http");
var http_2 = require("@angular/http");
var app_component_1 = require("./app.component");
var background_component_1 = require("./background/background.component");
var content_component_1 = require("./content/content.component");
var clock_component_1 = require("./content/clock/clock.component");
var setting_component_1 = require("./background/setting/setting.component");
var scene_component_1 = require("./background/scene/scene.component");
var list_component_1 = require("./content/list/list.component");
var fuck_off_component_1 = require("./content/fuck-off/fuck-off.component");
var asteroids_component_1 = require("./background/scene/asteroids/asteroids.component");
var phyllotaxy_component_1 = require("./background/scene/phyllotaxy/phyllotaxy.component");
var scene_selector_component_1 = require("./content/scene-selector/scene-selector.component");
var maze_component_1 = require("./background/scene/maze/maze.component");
var my_focus_directive_1 = require("./shared/directives/my-focus.directive");
var config_service_1 = require("./shared/services/config.service");
var clock_service_1 = require("./shared/services/clock.service");
var screen_size_service_1 = require("./shared/services/screen-size.service");
var search_component_1 = require("./content/search/search.component");
var search_service_1 = require("./shared/services/search.service");
var fuck_off_service_1 = require("./shared/services/fuck-off.service");
var scenes_service_1 = require("./shared/services/scenes.service");
var perlin_field_component_1 = require("./background/scene/perlin-field/perlin-field.component");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent,
            background_component_1.BackgroundComponent,
            content_component_1.ContentComponent,
            clock_component_1.ClockComponent,
            setting_component_1.SettingComponent,
            scene_component_1.SceneComponent,
            list_component_1.ListComponent,
            search_component_1.SearchComponent,
            my_focus_directive_1.MyFocusDirective,
            fuck_off_component_1.FuckOffComponent,
            asteroids_component_1.AsteroidsComponent,
            phyllotaxy_component_1.PhyllotaxyComponent,
            scene_selector_component_1.SceneSelectorComponent,
            maze_component_1.MazeComponent,
            perlin_field_component_1.PerlinFieldComponent
        ],
        imports: [
            http_1.HttpModule,
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_2.JsonpModule
        ],
        providers: [config_service_1.ConfigService, {
                provide: core_2.APP_INITIALIZER,
                useFactory: ConfigLoader,
                deps: [config_service_1.ConfigService],
                multi: true
            },
            // Add more services here:
            clock_service_1.ClockService, screen_size_service_1.ScreenSizeService, search_service_1.SearchService, fuck_off_service_1.FuckOffService, scenes_service_1.ScenesService],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
// Function needed to load config.json parameters before application startup.
function ConfigLoader(configService) {
    // Note: this factory need to return a function (that returns a promise)
    return function () { return configService.load(environment_1.environment.configFile); };
}
exports.ConfigLoader = ConfigLoader;
