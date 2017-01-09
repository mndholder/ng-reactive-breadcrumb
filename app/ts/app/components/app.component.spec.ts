import { getTestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BreadCrumbService } from '../../../../src/services/breadcrumb.service';

describe('App Component', () => {

    describe('Instance isolated tests', () => {

        let instance: AppComponent,
            service: BreadCrumbService;

        beforeEach(() => {
            service = getTestBed().get(BreadCrumbService);
            instance = new AppComponent(service);
        });

        it('should configure breadcrumb service on init', () => {
            let spy = spyOn(service, 'configure').and.callThrough();
            instance.ngOnInit();
            expect(spy).toHaveBeenCalled();
        });

        it('should provide onClick handler to set value through EventEmitter', () => {
            expect(instance.ee).toBeDefined();
            let spy = spyOn(instance.ee, 'emit').and.callThrough();
            instance.onClick();
            expect(spy).toHaveBeenCalled();
        });

    });

});
