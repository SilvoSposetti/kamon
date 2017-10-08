"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var background_component_1 = require("./background.component");
describe('BackgroundComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [background_component_1.BackgroundComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(background_component_1.BackgroundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
