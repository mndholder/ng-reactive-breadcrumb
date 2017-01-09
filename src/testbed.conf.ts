import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { BreadCrumbService } from './services/breadcrumb.service';
import { AppComponent } from '../app/ts/app/components/app.component';
import { BreadCrumbComponent } from './components/breadcrumb.component';

// Testing module will be recreated for every spec - this is exactly what we need
jasmine.getEnv().beforeEach(() => {

    @Component({
        template: '<router-outlet></router-outlet>'
    })
    class RoutingComponent {}

    @Component({
        template: '<router-outlet></router-outlet>'
    })
    class DummyComponent {}

    TestBed.configureTestingModule({
        imports: [
            RouterTestingModule.withRoutes([
                {path: 'first', component: DummyComponent, children: [
                    {path: 'second', component: DummyComponent, children: [
                        {path: 'third', component: DummyComponent}
                    ]}
                ]},
                {path: 'second', component: DummyComponent}
            ])
        ],
        declarations: [
            RoutingComponent,
            DummyComponent,
            AppComponent,
            BreadCrumbComponent
        ],
        providers: [
            BreadCrumbService
        ]
    });

    TestBed.createComponent(RoutingComponent).detectChanges();

});
