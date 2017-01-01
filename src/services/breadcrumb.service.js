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
var router_1 = require('@angular/router');
var Rx_1 = require('rxjs/Rx');
var NavigationStatus;
(function (NavigationStatus) {
    NavigationStatus[NavigationStatus["START"] = 1] = "START";
    NavigationStatus[NavigationStatus["ROUTES_RECOGNIZED"] = 2] = "ROUTES_RECOGNIZED";
    NavigationStatus[NavigationStatus["END"] = 3] = "END";
})(NavigationStatus || (NavigationStatus = {}));
var BreadCrumbService = (function () {
    function BreadCrumbService(_router) {
        var _this = this;
        this._router = _router;
        // Current breadcrumb trail subject
        this._trail = new Rx_1.Subject();
        // Current route
        this._currentRoute = '';
        // Map to save route config by the route's name
        this._routeConfig = new Map();
        // Additional map to save route config by the route's regexp
        this._routeRegExpConfig = new Map();
        this._router.events
            .do(function (evt) {
            switch (true) {
                case (evt instanceof router_1.NavigationStart):
                    _this._currentNavigationStatus = NavigationStatus.START;
                    break;
                case (evt instanceof router_1.RoutesRecognized):
                    _this._currentNavigationStatus = NavigationStatus.ROUTES_RECOGNIZED;
                    break;
                case (evt instanceof router_1.NavigationEnd):
                    _this._currentNavigationStatus = NavigationStatus.END;
                    break;
            }
        })
            .filter(function (evt) { return evt instanceof router_1.NavigationEnd; })
            .subscribe(function (evt) {
            _this._currentRoute = evt.urlAfterRedirects || evt.url;
            _this._trail.next(_this._generateBreadcrumbTrail(_this._currentRoute));
        });
    }
    Object.defineProperty(BreadCrumbService.prototype, "trail", {
        get: function () {
            return this._trail
                .asObservable()
                .map(function (urls) { return [].concat(urls); });
        },
        enumerable: true,
        configurable: true
    });
    BreadCrumbService.prototype.configureRoute = function (config) {
        var _this = this;
        if (config.children) {
            config.children.forEach(function (childConfig) {
                if (config.path instanceof RegExp || childConfig.path instanceof RegExp) {
                    throw new Error('RegExp route config does not support child routes!');
                }
                else {
                    childConfig.path = "" + config.path + childConfig.path;
                }
                _this.configureRoute(childConfig);
            });
        }
        var route = config.path;
        if (typeof (route) === 'string' && route.indexOf('*') !== -1) {
            route = new RegExp('^' + route.replace(/\*/g, '(?:[^\/]*)') + '$');
            config.path = route;
        }
        if (typeof (route) === 'string') {
            this._routeConfig.set(route, config);
        }
        else {
            this._routeRegExpConfig.set(route, config);
        }
    };
    BreadCrumbService.prototype.configure = function (routes) {
        var _this = this;
        routes.forEach(function (config) { return _this.configureRoute(config); });
    };
    BreadCrumbService.prototype.getRouteName = function (route) {
        var config = this._findRouteConfig(route);
        switch (true) {
            // if no config or no name, we'll generate the name
            case !config || !config.name:
                config.name = Rx_1.Observable.of(this._generateDefaultRouteName(route));
                break;
            // if name is a string, return an Observable
            case typeof (config.name) === 'string':
                config.name = Rx_1.Observable.of(config.name);
                break;
            // if name is a function, return an Observable from callback
            case typeof (config.name) === 'function':
                var callback_1 = config.name;
                config.name = Rx_1.Observable.create(function (observer) { return observer.next(callback_1(route)); });
                break;
            // convert subject to observable
            case config.name instanceof Rx_1.Subject:
                config.name = config.name.asObservable();
                break;
            // convert promise to observable
            case config.name instanceof Promise:
                config.name = Rx_1.Observable.fromPromise(config.name);
                break;
        }
        return config.name;
    };
    BreadCrumbService.prototype.isRouteHidden = function (route) {
        var config = this._findRouteConfig(route);
        return !!(config && config.hidden);
    };
    BreadCrumbService.prototype._findRouteConfig = function (route) {
        var config;
        config = this._routeConfig.get(route);
        if (!config) {
            // TS' ES5 target does not support for of Map, so we use the hard way...
            // It is better than Map.forEach, because we can break
            var iterator = this._routeRegExpConfig.keys();
            var value = iterator.next();
            while (!value.done) {
                var re = value.value;
                if (re.test(route)) {
                    if (re.test(route)) {
                        config = this._routeRegExpConfig.get(re);
                        break;
                    }
                }
                else {
                    value = iterator.next();
                }
            }
        }
        return config;
    };
    BreadCrumbService.prototype._generateBreadcrumbTrail = function (url) {
        var urls = [];
        while (url.lastIndexOf('/') >= 0) {
            if (!this.isRouteHidden(url)) {
                urls.unshift(url);
            }
            url = url.substr(0, url.lastIndexOf('/'));
        }
        return urls;
    };
    BreadCrumbService.prototype._generateDefaultRouteName = function (url) {
        var name;
        name = url.substr(url.lastIndexOf('/'), url.length).replace(/^\//, '');
        name = name.replace(/^\w/, name.charAt(0).toUpperCase());
        return name;
    };
    BreadCrumbService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [router_1.Router])
    ], BreadCrumbService);
    return BreadCrumbService;
}());
exports.BreadCrumbService = BreadCrumbService;
//# sourceMappingURL=breadcrumb.service.js.map