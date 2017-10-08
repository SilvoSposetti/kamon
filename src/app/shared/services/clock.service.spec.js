"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var clock_service_1 = require("./clock.service");
describe('ClockService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [clock_service_1.ClockService]
        });
    });
    it('should be created', testing_1.inject([clock_service_1.ClockService], function (service) {
        expect(service).toBeTruthy();
    }));
});
