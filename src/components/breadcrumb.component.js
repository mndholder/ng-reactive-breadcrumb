"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var breadcrumb_service_1 = require('../services/breadcrumb.service');
/**
 * Component metadata class.
 * This class can be extended and then use to extend the built-in component
 */
var BreadCrumbComponentMetadata = (function () {
    function BreadCrumbComponentMetadata() {
        /**
         * Standard angular selector property. Change to whatever you desire
         * @type {string}
         */
        this.selector = 'ng-reactive-breadcrumb';
        /**
         * Standard Angular template property. Change to whatever you desire
         * @type {string}
         */
        this.template = "\n        <ol class=\"breadcrumb\">\n            <li *ngFor=\"let url of urls; let last = last\" [ngClass]=\"{'active': last}\">\n                <a role=\"button\" *ngIf=\"!last\" [routerLink]=\"url\">\n                    {{getRouteName(url) | async}}\n                </a>\n                <span *ngIf=\"last\">\n                    {{getRouteName(url) | async}}\n                </span>\n            </li>\n        </ol>\n    ";
    }
    return BreadCrumbComponentMetadata;
}());
exports.BreadCrumbComponentMetadata = BreadCrumbComponentMetadata;
/**
 * Breadcrumb component.
 * Simple built-in component to render breadcrumb trail
 */
var BreadCrumbComponent = (function () {
    /**
     * Component constructor. Subscribes to the breadcrumb trail
     * @param _breadCrumbService BreadCrumb service which will fire trail changes
     */
    function BreadCrumbComponent(_breadCrumbService) {
        var _this = this;
        this._breadCrumbService = _breadCrumbService;
        /**
         * Input property which limits the trail to the minimum number of entries to fill in the urls property
         * @type {number}
         */
        this.min = 0;
        this._subscription = this._breadCrumbService.trail
            .subscribe(function (urls) {
            _this.urls = urls.length >= _this.min ? urls : [];
        });
    }
    /**
     * Method allows to receive a route name
     * @param url Route(Path) to receive the name of
     * @returns {Observable<any>} Name as an Observable which you will have to subscribe to
     */
    BreadCrumbComponent.prototype.getRouteName = function (url) {
        return this._breadCrumbService.getRouteName(url);
    };
    /**
     * Destroy method. Unsubscribes from the breadcrumb trail
     */
    BreadCrumbComponent.prototype.ngOnDestroy = function () {
        this._subscription.unsubscribe();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], BreadCrumbComponent.prototype, "min", void 0);
    BreadCrumbComponent = __decorate([
        core_1.Component(new BreadCrumbComponentMetadata()), 
        __metadata('design:paramtypes', [breadcrumb_service_1.BreadCrumbService])
    ], BreadCrumbComponent);
    return BreadCrumbComponent;
}());
exports.BreadCrumbComponent = BreadCrumbComponent;
//# sourceMappingURL=breadcrumb.component.js.map