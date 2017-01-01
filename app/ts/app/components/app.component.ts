import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadCrumbService } from '../../../../src/ng2-reactive-breadcrumb';

import '../../../styles/app.scss';

@Component({
    selector: 'ng2-app',
    template: `
        <ng2-reactive-breadcrumb></ng2-reactive-breadcrumb>
        <div class="container">
          <p>Click on the links below and look how the breadcrumb trail changes.</p>
          <ul>
              <li><a [routerLink]="'/one'">One</a></li>
              <li><a [routerLink]="'/one/two'">Two</a></li>
              <li><a [routerLink]="'/one/two/three'">Three</a></li>
              <li><a [routerLink]="'/one/two/three/four'">Four</a></li>
              <li><a [routerLink]="'/one/two/three/four/five'">Five</a></li>
              <li><a [routerLink]="'/one/two/three/four/five/six'">Six</a></li>
          </ul>
          <router-outlet></router-outlet>
        </div>
    `
})
export class AppComponent implements OnInit {
    constructor(
        private breadCrumbsService: BreadCrumbService
    ) {}

    ngOnInit() {
        this.breadCrumbsService.configure([
            {path: '/one', name: 'ONE'},
            {path: '/one/two', name: '2-as-two', children: [
                {path: '/three', name: ((path: string) => {
                    return path.split('/').filter(el => !!el).join(' > ');
                })}
            ]},
            {path: '/one/*/three/four', name: 'Four', children: [
                {path: '/*', name: Observable.interval(1000)
                    .startWith(0)
                    .map((num) => `Time elapsed: ${num}s`)},
                {path: '/five/six', name: new Promise(resolve => {
                    setTimeout(() => resolve('Six: 1000ms'), 1000);
                })}
            ]}
        ]);
    }
}
