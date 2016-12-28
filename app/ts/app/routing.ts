import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './components/test.component';

const routes: Routes = [
    {path: '', component: TestComponent},
    {path: 'one', component: TestComponent, children: [
        {path: 'two', component: TestComponent, children: [
            {path: 'three', component: TestComponent, children: [
                {path: 'four', component: TestComponent, children: [
                    {path: 'five', component: TestComponent}
                ]}
            ]}
        ]}
    ]}
];

export const routing = RouterModule.forRoot(routes);
