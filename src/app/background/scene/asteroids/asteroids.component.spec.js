"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var asteroids_component_1 = require("./asteroids.component");
describe('AsteroidsComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [asteroids_component_1.AsteroidsComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(asteroids_component_1.AsteroidsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
