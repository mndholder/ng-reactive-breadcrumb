import { Injectable, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, RoutesRecognized } from '@angular/router';
import { Subject, Observable } from 'rxjs/Rx';

/**
 * Route config interface
 * Used to send the data into configureRoute method
 */
export interface IBreadCrumbRouteConfig {
    /**
     * The path to configure.
     * Can be a string or a RegExp.
     * String may include wildcart character
     */
    path: string | RegExp;
    /**
     * Name for the configured route.
     * Can be a static string or an Observable.
     * Basically can be anything that is compatible with Angular2 asyn pipe
     */
    name?: string | Function | Observable<any> | Subject<any> | Promise<any> | EventEmitter<any>;
    hidden?: boolean;
    children?: IBreadCrumbRouteConfig[];
}

/**
 * Enum to define current navigation status
 */
enum NavigationStatus {
    /**
     * NavigationStart event
     * @type {number}
     */
    START = 1,
    /**
     * Routes recognized event
     * @type {number}
     */
    ROUTES_RECOGNIZED = 2,
    /**
     * NavigationEnd event
     * @type {number}
     */
    END = 3
}

/**
 * Main breadcrumb services.
 * Used to subscribe to router events and return names for desired paths and routes.
 * Should be properly to configured to use advanced features
 */
@Injectable()
export class BreadCrumbService {
    /**
     * Current breadcrumb trail subject
     * @type {Subject<string[]>}
     * @private
     */
    private _trail: Subject<string[]> = new Subject<string[]>();
    /**
     * Current route
     * @type {string}
     * @private
     */
    private _currentRoute: string = '';
    /**
     * Current navigation status
     */
    private _currentNavigationStatus: NavigationStatus;
    /**
     * Map to save route config by the route's name
     * @type {Map<string, IBreadCrumbRouteConfig>}
     * @private
     */
    private _routeConfig: Map<string, IBreadCrumbRouteConfig> = new Map<string, IBreadCrumbRouteConfig>();
    /**
     * Additional map to save route config by the route's regexp
     * @type {Map<RegExp, IBreadCrumbRouteConfig>}
     * @private
     */
    private _routeRegExpConfig: Map<RegExp, IBreadCrumbRouteConfig> = new Map<RegExp, IBreadCrumbRouteConfig>();

    /**
     * Service constructor.
     * Subscribes to router events
     * @param _router Application router
     */
    constructor(private _router: Router) {
        this._router.events
            .do(evt => {
                switch (true) {
                    case (evt instanceof NavigationStart):
                        this._currentNavigationStatus = NavigationStatus.START;
                        break;
                    case (evt instanceof RoutesRecognized):
                        this._currentNavigationStatus = NavigationStatus.ROUTES_RECOGNIZED;
                        break;
                    case (evt instanceof NavigationEnd):
                        this._currentNavigationStatus = NavigationStatus.END;
                        break;
                }
            })
            .filter(evt => evt instanceof NavigationEnd)
            .subscribe((evt: NavigationEnd) => {
                this._currentRoute = evt.urlAfterRedirects || evt.url;
                this._trail.next(this._generateBreadcrumbTrail(this._currentRoute));
            });
    }

    /**
     * Trail getter.
     * Returns the current trail as an Observable that you have to subscribe to.
     * Will fire every time the trail changes with new trail values
     * @returns {Observable<R>} Observable which will be resolved new trail values
     */
    get trail(): Observable<string[]> {
        return this._trail
            .asObservable()
            .map(urls => [].concat(urls));
    }

    /**
     * Configure route method.
     * Used to configure one path
     * @param config configuration object which implements IBreadCrumbRouteConfig
     */
    configureRoute(config: IBreadCrumbRouteConfig) {
        if (config.children) {
            config.children.forEach((childConfig: IBreadCrumbRouteConfig) => {
                if (config.path instanceof RegExp || childConfig.path instanceof RegExp) {
                    throw new Error('RegExp route config does not support child routes!');
                } else {
                    childConfig.path = `${config.path}${childConfig.path}`;
                }
                this.configureRoute(childConfig);
            });
        }

        let route = config.path;

        if (typeof(route) === 'string' && (route as string).indexOf('*') !== -1) {
            route = new RegExp('^' + (route as string).replace(/\*/g, '(?:[^\/]*)') + '$');
            config.path = route;
        }

        if (typeof(route) === 'string') {
            this._routeConfig.set(route as string, config);
        } else {
            this._routeRegExpConfig.set(route as RegExp, config);
        }
    }

    /**
     * Configure routes method.
     * Used to configure more than one route. Accepts array of IBreadCrumbRouteConfig
     * @param routes Array of objects which implement IBreadCrumbRouteConfig
     */
    configure(routes: IBreadCrumbRouteConfig[]) {
        routes.forEach(config => this.configureRoute(config));
    }

    /**
     * This methods returns the desired route name as an Observable you will have to subscribe to
     * @param route Route to get the name of
     * @returns {Observable<any>} Observable which will be resolved with the route's name
     */
    getRouteName(route: string): Observable<any> {
        let config: IBreadCrumbRouteConfig = this._findRouteConfig(route);
        switch (true) {
            // if no config or no name, we'll generate the name
            case !config || !config.name:
                return Observable.of(this._generateDefaultRouteName(route));
            // if name is a string, return an Observable
            case typeof (config.name) === 'string':
                config.name = Observable.of(config.name);
                break;
            // if name is a function, return an Observable from callback
            case typeof (config.name) === 'function':
                let callback = config.name as (path: string) => any;
                config.name = Observable.create(observer => observer.next(callback(route)));
                break;
            // convert subject to observable (applies to EventEmitter as well)
            case config.name instanceof Subject:
            case config.name instanceof EventEmitter:
                config.name = (config.name as Subject<any>).asObservable();
                break;
            // convert promise to observable
            case config.name instanceof Promise:
                config.name = Observable.fromPromise((config.name as Promise<any>));
                break;
            // if Observable - just return it
        }
        return config.name as Observable<any>;
    }

    /**
     * Check if the route is hidden
     * @param route Route to check
     * @returns {boolean} true if hidden, false if not
     */
    isRouteHidden(route: string): boolean {
        let config: IBreadCrumbRouteConfig = this._findRouteConfig(route);
        return !!(config && config.hidden);
    }

    /**
     * Private method to find the route config in one of two maps
     * @param route Route, which config we need to find
     * @returns {IBreadCrumbRouteConfig} Config object which implements IBreadCrumbRouteConfig
     * @private
     */
    private _findRouteConfig(route: string): IBreadCrumbRouteConfig {
        let config: IBreadCrumbRouteConfig;
        config = this._routeConfig.get(route);
        if (!config) {
            // TS' ES5 target does not support for of Map, so we use the hard way...
            // It is better than Map.forEach, because we can break
            let iterator = this._routeRegExpConfig.keys();
            let value: IteratorResult<RegExp> = iterator.next();
            while (!value.done) {
                let re = value.value;
                if (re.test(route)) {
                    config = this._routeRegExpConfig.get(re);
                    break;
                } else {
                    value = iterator.next();
                }
            }
        }
        return config;
    }

    /**
     * Private method which generates breadcrumb trail
     * @param url Current location url
     * @returns {string[]} Array of strings, which represent the current breadcrumb trail
     * @private
     */
    private _generateBreadcrumbTrail(url: string) {
        let urls: string[] = [];
        while (url.lastIndexOf('/') >= 0) {
            if (!this.isRouteHidden(url)) {
                urls.unshift(url);
            }
            url = url.substr(0, url.lastIndexOf('/'));
        }
        return urls;
    }

    /**
     * Default route name generator.
     * If path is not configured, then the path name is taken and the first character is capitalized.
     * For example: '/first' -> 'First', '/first/second' -> 'Second', etc
     * @param url Url to generate the name for
     * @returns {string|any} Generated name
     * @private
     */
    private _generateDefaultRouteName(url: string) {
        let name;
        name = url.substr(url.lastIndexOf('/'), url.length).replace(/^\//, '');
        name = name.replace(/^\w/, name.charAt(0).toUpperCase());
        return name;
    }
}
