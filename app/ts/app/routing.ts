import { RouterModule, Routes, Route } from '@angular/router';
import { TestComponent } from './components/test.component';

const ROUTES = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

const routes: Routes = [
    ROUTES.reduceRight((prev: Route, val) => {
        return Object.assign(
            {},
            {path: val, component: TestComponent},
            prev.path ? {children: [prev]} : undefined
        );
    }, {}),
    {path: '**', redirectTo: 'one'}
];

export const routing = RouterModule.forRoot(routes);
