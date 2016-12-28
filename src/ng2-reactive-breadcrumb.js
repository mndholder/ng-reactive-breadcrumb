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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var common_1 = require('@angular/common');
var router_1 = require('@angular/router');
var breadcrumb_component_1 = require('./components/breadcrumb.component');
var breadcrumbs_service_1 = require('./services/breadcrumbs.service');
var Ng2ReactiveBreadCrumbModule = (function () {
    function Ng2ReactiveBreadCrumbModule() {
    }
    Ng2ReactiveBreadCrumbModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                common_1.CommonModule,
                router_1.RouterModule.forChild([])
            ],
            declarations: [
                breadcrumb_component_1.BreadCrumbComponent
            ],
            providers: [
                breadcrumbs_service_1.BreadCrumbService
            ],
            exports: [
                breadcrumb_component_1.BreadCrumbComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], Ng2ReactiveBreadCrumbModule);
    return Ng2ReactiveBreadCrumbModule;
}());
exports.Ng2ReactiveBreadCrumbModule = Ng2ReactiveBreadCrumbModule;
__export(require('./components/breadcrumb.component'));
__export(require('./services/breadcrumbs.service'));
//# sourceMappingURL=ng2-reactive-breadcrumb.js.map