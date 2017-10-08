"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var scene_component_1 = require("./scene.component");
describe('SceneComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [scene_component_1.SceneComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(scene_component_1.SceneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
