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
var BreadCrumbComponentMetadata = (function () {
    function BreadCrumbComponentMetadata() {
        this.selector = 'ng2-reactive-breadcrumb';
        this.template = "\n        <ol class=\"mmp-breadcrumbs breadcrumb\">\n            <li *ngFor=\"let url of urls; let last = last\" [ngClass]=\"{'active': last}\">\n                <a role=\"button\" *ngIf=\"!last\" [routerLink]=\"url\">\n                    {{getRouteName(url) | async}}\n                </a>\n                <span *ngIf=\"last\">\n                    {{getRouteName(url) | async}}\n                </span>\n            </li>\n        </ol>\n    ";
    }
    return BreadCrumbComponentMetadata;
}());
exports.BreadCrumbComponentMetadata = BreadCrumbComponentMetadata;
var BreadCrumbComponent = (function () {
    function BreadCrumbComponent(_breadCrumbService) {
        var _this = this;
        this._breadCrumbService = _breadCrumbService;
        this.min = 0;
        this._subscription = this._breadCrumbService.trail
            .subscribe(function (urls) {
            _this.urls = urls.length >= _this.min ? urls : [];
        });
    }
    BreadCrumbComponent.prototype.getRouteName = function (url) {
        return this._breadCrumbService.getRouteName(url).first();
    };
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