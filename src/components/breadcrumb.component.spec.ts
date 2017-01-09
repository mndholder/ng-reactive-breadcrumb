import { getTestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BreadCrumbComponent } from './breadcrumb.component';
import { BreadCrumbService } from '../services/breadcrumb.service';
import { DebugElement } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('BreadCrumb Component', () => {

    let service: BreadCrumbService,
        router: Router;

    beforeEach(() => {
        service = getTestBed().get(BreadCrumbService);
        router = getTestBed().get(Router);
    });

    describe('Instance isolated tests', () => {

        let instance: BreadCrumbComponent,
            subscription: Subscription;

        beforeEach(() => {
            instance = new BreadCrumbComponent(service);
            subscription = (instance as any)._subscription;
        });

        it('should subscribe to the service\'s trail and update its own public property', fakeAsync(() => {
            expect(instance.urls).toBeUndefined();
            expect(subscription).toBeDefined();

            router.navigate(['first']);
            tick();
            expect(instance.urls).toEqual(['/first']);

            router.navigate(['first', 'second']);
            tick();
            expect(instance.urls).toEqual(['/first', '/first/second']);

            router.navigate(['first', 'second', 'third']);
            tick();
            expect(instance.urls).toEqual(['/first', '/first/second', '/first/second/third']);
        }));

        it('should have a min input property which limits the min trail length', fakeAsync(() => {
            instance.min = 2;

            router.navigate(['first']);
            tick();
            expect(instance.urls).toEqual([]);

            router.navigate(['first', 'second']);
            tick();
            expect(instance.urls).toEqual(['/first', '/first/second']);
        }));

        it('should return name observable from the service', () => {
            let spy = spyOn(service, 'getRouteName').and.callThrough();
            let obs = instance.getRouteName('/first');
            expect(obs instanceof Observable).toBe(true);
            expect(spy).toHaveBeenCalled();
            obs.subscribe(name => {
               expect(name).toBe('First');
            });
        });

        it('should unsubscribe from the trail when destoyed', () => {
            let spy = spyOn(subscription, 'unsubscribe').and.callThrough();
            instance.ngOnDestroy();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('Rendering tests', () => {

        let fixture: ComponentFixture<BreadCrumbComponent>,
            de: DebugElement;

        beforeEach(() => {
            fixture = getTestBed().createComponent(BreadCrumbComponent);
            de = fixture.debugElement;

            service.configure([
                {path: '/first', name: 'FIRST', children: [
                    {path: '/second', name: 'SECOND', children: [
                        {path: '/third', name: 'THIRD'}
                    ]}
                ]},
                {path: '/second', name: 'SECOND'}
            ]);
        });

        it('should render a span if there is only one element in the trail', fakeAsync(() => {
            router.navigate(['first']);
            tick();
            fixture.detectChanges();

            let span = de.query(By.css('span')).nativeElement;
            expect(span.textContent.trim()).toBe('FIRST');
        }));

        it('should render anchors for the trail and span in the end', fakeAsync(() => {
            router.navigate(['first', 'second', 'third']);
            tick();
            fixture.detectChanges();

            let anchors = de.queryAll(By.css('a')),
                span = de.query(By.css('span'));

            expect(anchors.length).toBe(2);
            expect(anchors[0].nativeElement.textContent.trim()).toBe('FIRST');
            expect(anchors[1].nativeElement.textContent.trim()).toBe('SECOND');
            expect(span.nativeElement.textContent.trim()).toBe('THIRD');
        }));

        it('\'s anchors should take you to the breadcrumb trail element', fakeAsync(() => {
            router.navigate(['first', 'second', 'third']);
            tick();
            fixture.detectChanges();

            let anchor = de.query(By.css('a')).nativeElement;
            expect(anchor.textContent.trim()).toBe('FIRST');
            expect(router.url).toBe('/first/second/third');

            anchor.click();
            tick();
            expect(router.url).toBe('/first');
        }));

        it('should display names from observables', fakeAsync(() => {
            service.configureRoute({path: '/second', name: Observable.of('TEST')});
            router.navigate(['second']);
            tick();
            fixture.detectChanges();

            let span = de.query(By.css('span')).nativeElement;
            expect(span.textContent.trim()).toBe('TEST');
        }));

        it('should display new data from observable stream', fakeAsync(() => {
            let span: HTMLSpanElement,
                subject = new BehaviorSubject('1');

            service.configureRoute({path: '/second', name: subject});
            router.navigate(['second']);
            tick();
            fixture.detectChanges();

            span = de.query(By.css('span')).nativeElement;
            expect(span.textContent.trim()).toBe('1');

            subject.next('2');
            fixture.detectChanges();
            expect(span.textContent.trim()).toBe('2');

            subject.next('3');
            fixture.detectChanges();
            expect(span.textContent.trim()).toBe('3');

        }));

    });

});
