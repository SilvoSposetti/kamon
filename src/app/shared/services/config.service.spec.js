"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var config_service_1 = require("./config.service");
describe('ConfigService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [config_service_1.ConfigService]
        });
    });
    it('should be created', testing_1.inject([config_service_1.ConfigService], function (service) {
        expect(service).toBeTruthy();
    }));
});
