import { Component, OnInit } from '@angular/core';
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
            {route: '/one', name: 'ONE'},
            {route: '/one/two', name: '2-as-two'},
            {route: '/one/*/three', name: 'three-omg'}
        ]);
    }
}
