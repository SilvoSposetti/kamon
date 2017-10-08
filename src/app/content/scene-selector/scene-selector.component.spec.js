"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var scene_selector_component_1 = require("./scene-selector.component");
describe('SceneSelectorComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [scene_selector_component_1.SceneSelectorComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(scene_selector_component_1.SceneSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
