"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var screen_size_service_1 = require("./screen-size.service");
describe('ScreenSizeService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [screen_size_service_1.ScreenSizeService]
        });
    });
    it('should be created', testing_1.inject([screen_size_service_1.ScreenSizeService], function (service) {
        expect(service).toBeTruthy();
    }));
});
