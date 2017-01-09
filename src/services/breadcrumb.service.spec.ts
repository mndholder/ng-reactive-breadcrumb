import { getTestBed, fakeAsync, tick } from '@angular/core/testing';
import { BreadCrumbService } from './breadcrumb.service';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import createSpy = jasmine.createSpy;

describe ('Breadcrumb Service', () => {

    let service: BreadCrumbService,
        router: Router;

    beforeEach(() => {
        let injector = getTestBed();
        service = injector.get(BreadCrumbService);
        router = injector.get(Router);
    });

    describe('Trail property', () => {

        let url;
        beforeEach(() => {
            url = undefined;
            service.configure([
                {path: '/first', name: 'FIRST'},
                {path: '/second', name: 'SECOND'},
                {path: '/first/second/third', name: 'THIRD'}
            ]);
            service.trail.subscribe(_url => url = _url);
        });

        it('should have a trail property', () => {
            expect(service.trail).toBeDefined();
            expect(service.trail instanceof Observable).toBe(true);
        });

        it('s trail changes when router navigates to a path', fakeAsync(() => {
            expect(url).toBeUndefined();

            router.navigate(['first']);
            tick();
            expect(url).toEqual(['/first']);

            router.navigate(['second']);
            tick();
            expect(url).toEqual(['/second']);
        }));

        it('s trail should be an array of all the paths in the route', fakeAsync(() => {
            expect(url).toBeUndefined();

            router.navigate(['first']);
            tick();
            expect(url).toEqual(['/first']);

            router.navigate(['first', 'second']);
            tick();
            expect(url).toEqual(['/first', '/first/second']);

            router.navigate(['first', 'second', 'third']);
            tick();
            expect(url).toEqual(['/first', '/first/second', '/first/second/third']);
        }));

        it('should not include hidden routes in the trail', fakeAsync(() => {
            service.configureRoute({path: '/first/second/third', hidden: true});

            router.navigate(['first', 'second']);
            tick();
            expect(url).toEqual(['/first', '/first/second']);

            router.navigate(['first', 'second', 'third']);
            tick();
            expect(url).toEqual(['/first', '/first/second']);
        }));

    });

    describe('Configuring routes and paths', () => {

        function getStaticName(path: string) {
            let name: string;
            service.getRouteName(path).subscribe(_name => name = _name);
            return name;
        }

        it('should allow configuring routes one by one', () => {
            service.configureRoute({path: '/first', name: 'FIRST'});
            expect(getStaticName('/first')).toBe('FIRST');

            service.configureRoute({path: '/first/second', name: 'SECOND'});
            expect(getStaticName('/first')).toBe('FIRST');
            expect(getStaticName('/first/second')).toBe('SECOND');

            service.configureRoute({path: '/first/second/third', name: 'THIRD'});
            expect(getStaticName('/first')).toBe('FIRST');
            expect(getStaticName('/first/second')).toBe('SECOND');
            expect(getStaticName('/first/second/third')).toBe('THIRD');
        });

        it('should allow configuring routes at once', () => {
            let spy = spyOn(service, 'configureRoute').and.callThrough();

            service.configure([
                {path: '/first', name: 'FIRST'},
                {path: '/first/second', name: 'SECOND'},
                {path: '/first/second/third', name: 'THIRD'}
            ]);

            expect(spy).toHaveBeenCalled();
            expect(spy.calls.count()).toBe(3);

            expect(getStaticName('/first')).toBe('FIRST');
            expect(getStaticName('/first/second')).toBe('SECOND');
            expect(getStaticName('/first/second/third')).toBe('THIRD');
        });

        describe('Path configuration', () => {
            describe('Zero configuration', () => {
                it('should be possible to not configure the service at all', () => {
                    expect(getStaticName('/no-need-to-configure')).toBe('No-need-to-configure');
                });
            });

            describe('Static configuration', () => {
                beforeEach(() => {
                    service.configure([
                        {path: '/first', name: 'FIRST'},
                        {path: '/first/second', name: 'SECOND'},
                        {path: '/first/second/third', name: 'THIRD', hidden: true}
                    ]);
                });

                it('should be possible to just provide static names', () => {
                    expect(getStaticName('/first')).toBe('FIRST');
                    expect(getStaticName('/first/second')).toBe('SECOND');
                    expect(service.isRouteHidden('/first/second/third')).toBe(true);
                });

                it('should be possible to override the previous static configuration', () => {
                    expect(getStaticName('/first')).toBe('FIRST');
                    service.configureRoute({path: '/first', name: 'DIFFERENT'});
                    expect(getStaticName('/first')).toBe('DIFFERENT');
                });
            });

            describe('Regexp configuration', () => {
                beforeEach(() => {
                    service.configure([
                        {path: '/first', name: 'FIRST'},
                        {path: /first\/second$/, name: 'SECOND'},
                        {path: /first\/second\/[^/]+$/, name: 'THIRD', hidden: true}
                    ]);
                });

                it('should be possible to provide path names as regular expressions', () => {
                    expect(getStaticName('/first')).toBe('FIRST');
                    expect(getStaticName('/first/second')).toBe('SECOND');
                    expect(service.isRouteHidden('/first/second/third')).toBe(true);
                });

                xit('should be possible to override the previous regexp configuration', () => {
                    service.configureRoute({path: /first\/second\/[^/]+$/, name: 'THIRD', hidden: false});
                    expect(service.isRouteHidden('/first/second/third')).toBe(false);
                });

                it('does not matter if there are more than one match, only the first one works', () => {
                    service.configureRoute({path: /first\/second\/third$/, name: 'DIFFERENT'});
                    expect(getStaticName('first/second/third')).toBe('THIRD');
                });
            });

            describe('Wildcart configuration', () => {

                beforeEach(() => {
                    service.configure([
                        {path: '/first', name: 'FIRST'},
                        {path: '/first/*', name: 'SECOND'}
                    ]);
                });

                it('should be possible to use wildcart as a shortcut to creating regular expressions', () => {
                    expect(getStaticName('/first/second')).toBe('SECOND');
                    expect(getStaticName('/first/foo')).toBe('SECOND');
                    expect(getStaticName('/first/bar')).toBe('SECOND');
                });

                it('should not be greedy', () => {
                    expect(getStaticName('/first/second')).toBe('SECOND');
                    expect(getStaticName('/first/foo')).toBe('SECOND');
                    // Auto generated name
                    expect(getStaticName('/first/second/third')).toBe('Third');

                    service.configureRoute({path: '/first/*/third', name: 'DIFFERENT'});
                    expect(getStaticName('/first/second/third')).toBe('DIFFERENT');
                });

                it('should be possible to combine wildcarts in one config', () => {
                    service.configureRoute({path: '/first/*/*', name: 'THIRD'});
                    expect(getStaticName('/first/second/third')).toBe('THIRD');
                    expect(getStaticName('/first/foo/bar')).toBe('THIRD');
                    expect(getStaticName('/first/bar/foo')).toBe('THIRD');
                });
            });
        });

        describe('Name configuration', () => {

            describe('Static name configuration', () => {

                it('should be possible to provide static name configuration', () => {
                    service.configureRoute({path: '/first', name: 'FIRST'});
                    expect(getStaticName('/first')).toBe('FIRST');
                });

            });

            describe('Function name configuration', () => {

                it('should be possible to provide name as a callback function', () => {
                    let callback = createSpy('callback').and.returnValue('FIRST');
                    service.configureRoute({path: '/first', name: callback});
                    expect(callback).not.toHaveBeenCalled();
                    expect(getStaticName('/first')).toBe('FIRST');
                    expect(callback).toHaveBeenCalledWith('/first');
                });

            });

            describe('Subject and EventEmitter name configuration', () => {

                it('should be possible to provide Subject as name', () => {
                    let subject = new Subject();

                    service.configureRoute({path: '/first', name: subject});
                    let name: string;
                    service.getRouteName('/first').subscribe((_name: string) => name = _name);

                    expect(name).toBeUndefined();
                    subject.next('FIRST');
                    expect(name).toBe('FIRST');
                    subject.next('SECOND');
                    expect(name).toBe('SECOND');
                });

                it('should be possible to provide EventEmitter as a name', () => {
                    let ee = new EventEmitter<string>();

                    service.configureRoute({path: '/first', name: ee});
                    let name: string;
                    service.getRouteName('/first').subscribe((_name: string) => name = _name);

                    expect(name).toBeUndefined();
                    ee.emit('FIRST');
                    expect(name).toBe('FIRST');
                    ee.emit('SECOND');
                    expect(name).toBe('SECOND');
                });

            });

            describe('Promise name configuration', () => {

                it('should be possible to provide Promise as name', fakeAsync(() => {
                    let promise = Promise.resolve('FIRST');

                    service.configureRoute({path: '/first', name: promise});
                    let name: string;
                    service.getRouteName('/first').subscribe((_name: string) => name = _name);

                    expect(name).toBeUndefined();
                    tick();
                    expect(name).toBe('FIRST');
                }));

            });

            describe('Observable name configuration', () => {

                it('should be possible to provide Observable as name', () => {
                    let observable = Observable.of('FIRST');

                    service.configureRoute({path: '/first', name: observable});
                    let name: string;
                    service.getRouteName('/first').subscribe((_name: string) => name = _name);

                    expect(name).toBe('FIRST');
                    expect(service.getRouteName('/first')).toBe(observable);
                });

            });
        });

        describe('Children configuration', () => {

            it('should be possible to define route children', () => {
                let spy = spyOn(service, 'configureRoute').and.callThrough();

                const CONFIG = {path: '/first', name: 'FIRST', children: [
                    {path: '/second', name: 'SECOND'},
                    {path: '/third', name: 'THIRD'}
                ]};

                service.configureRoute(CONFIG);

                expect(spy).toHaveBeenCalled();
                expect(spy.calls.count()).toBe(3);
                expect(spy.calls.argsFor(0)[0]).toEqual(CONFIG);
                expect(spy.calls.argsFor(1)[0]).toEqual(CONFIG.children[0]);
                expect(spy.calls.argsFor(2)[0]).toEqual(CONFIG.children[1]);

                expect(getStaticName('/first')).toBe('FIRST');
                expect(getStaticName('/first/second')).toBe('SECOND');
                expect(getStaticName('/first/third')).toBe('THIRD');
            });

            it('should be possible to define children\'s children', () => {
                let spy = spyOn(service, 'configureRoute').and.callThrough();

                const CONFIG = {path: '/first', name: 'FIRST', children: [
                    {path: '/second', name: 'SECOND', children: [
                        {path: '/third', name: 'THIRD'}
                    ]}
                ]};

                service.configureRoute(CONFIG);

                expect(spy).toHaveBeenCalled();
                expect(spy.calls.count()).toBe(3);
                expect(spy.calls.argsFor(0)[0]).toEqual(CONFIG);
                expect(spy.calls.argsFor(1)[0]).toEqual(CONFIG.children[0]);
                expect(spy.calls.argsFor(2)[0]).toEqual(CONFIG.children[0].children[0]);

                expect(getStaticName('/first')).toBe('FIRST');
                expect(getStaticName('/first/second')).toBe('SECOND');
                expect(getStaticName('/first/second/third')).toBe('THIRD');
            });

            it('should be possible to use wildcarts in children config', () => {
                const CONFIG = {path: '/first', name: 'FIRST', children: [
                    {path: '/second', name: 'SECOND', children: [
                        {path: '/*', name: 'THIRD', children: [
                            {path: '/*', name: 'FOURTH'}
                        ]}
                    ]}
                ]};

                service.configureRoute(CONFIG);
                expect(getStaticName('/first/second/third')).toBe('THIRD');
                expect(getStaticName('/first/second/foo')).toBe('THIRD');
                expect(getStaticName('/first/second/bar')).toBe('THIRD');
                expect(getStaticName('/first/second/bar/whatever')).toBe('FOURTH');
            });

            it('should not be possible to use regexp in children config', () => {
                const CONFIG = {path: '/first', name: 'FIRST', children: [
                    {path: '/second', name: 'SECOND', children: [
                        {path: /third$/, name: 'THIRD'}
                    ]}
                ]};

                try {
                    service.configureRoute(CONFIG);
                } catch (e) {
                    expect(e).toBeDefined();
                    expect(e.message).toBe('RegExp route config does not support child routes!');
                }
            });

            it('should not be possible to use regexp in a parent path', () => {
                const CONFIG = {path: '/first', name: 'FIRST', children: [
                    {path: /second$/, name: 'SECOND', children: [
                        {path: '/third', name: 'THIRD'}
                    ]}
                ]};

                try {
                    service.configureRoute(CONFIG);
                } catch (e) {
                    expect(e).toBeDefined();
                    expect(e.message).toBe('RegExp route config does not support child routes!');
                }
            });

        });
    });

    describe('Other', () => {

        const FIRST_NAME = 'TEST-1';
        const SECOND_NAME = 'TEST-2';

        beforeEach(() => {
            service.configure([
                {path: '/test1', name: FIRST_NAME},
                {path: '/test2', name: SECOND_NAME, hidden: true}
            ]);
        });

        it('should return an Observable instead of direct name', () => {
            let obs = service.getRouteName('/test1');
            expect(obs instanceof Observable).toBe(true);
        });

        it('should allow to get route name via an Observable', () => {
            service.getRouteName('/test1').subscribe(name => {
                expect(name).toBe(FIRST_NAME);
            });
            service.getRouteName('/test2').subscribe(name => {
                expect(name).toBe(SECOND_NAME);
            });
        });

        it('should allow checking if some routes are hidden', () => {
            expect(service.isRouteHidden('/test1')).toBe(false);
            expect(service.isRouteHidden('/test2')).toBe(true);
        });

        it('should generate names for non-configured routes', () => {
            service.getRouteName('/foo').subscribe(name => {
                expect(name).toBe('Foo');
            });
            service.getRouteName('/bar-baz').subscribe(name => {
                expect(name).toBe('Bar-baz');
            });
        });

    });
});
