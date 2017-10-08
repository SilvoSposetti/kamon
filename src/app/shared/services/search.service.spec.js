"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var search_service_1 = require("./search.service");
describe('SearchService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [search_service_1.SearchService]
        });
    });
    it('should be created', testing_1.inject([search_service_1.SearchService], function (service) {
        expect(service).toBeTruthy();
    }));
});
