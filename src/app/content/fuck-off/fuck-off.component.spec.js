"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var fuck_off_component_1 = require("./fuck-off.component");
describe('FuckOffComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [fuck_off_component_1.FuckOffComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(fuck_off_component_1.FuckOffComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
