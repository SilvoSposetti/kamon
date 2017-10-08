"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var fuck_off_service_1 = require("./fuck-off.service");
describe('FuckOffService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [fuck_off_service_1.FuckOffService]
        });
    });
    it('should be created', testing_1.inject([fuck_off_service_1.FuckOffService], function (service) {
        expect(service).toBeTruthy();
    }));
});
