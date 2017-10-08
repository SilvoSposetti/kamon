"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var perlin_field_component_1 = require("./perlin-field.component");
describe('PerlinFieldComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [perlin_field_component_1.PerlinFieldComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(perlin_field_component_1.PerlinFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
