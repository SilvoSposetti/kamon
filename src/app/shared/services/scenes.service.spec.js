"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var scenes_service_1 = require("./scenes.service");
describe('ScenesService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [scenes_service_1.ScenesService]
        });
    });
    it('should be created', testing_1.inject([scenes_service_1.ScenesService], function (service) {
        expect(service).toBeTruthy();
    }));
});
