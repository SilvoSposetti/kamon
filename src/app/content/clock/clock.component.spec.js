"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var clock_component_1 = require("./clock.component");
describe('ClockComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [clock_component_1.ClockComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(clock_component_1.ClockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
