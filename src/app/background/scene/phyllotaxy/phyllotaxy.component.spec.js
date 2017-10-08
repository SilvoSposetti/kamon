"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var phyllotaxy_component_1 = require("./phyllotaxy.component");
describe('PhyllotaxyComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [phyllotaxy_component_1.PhyllotaxyComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(phyllotaxy_component_1.PhyllotaxyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
