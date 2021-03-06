import { Component, OnInit, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadCrumbService } from '../../../../src/ng-reactive-breadcrumb';

import '../../../styles/app.scss';

@Component({
    selector: 'ng-app',
    template: `
        <ng-reactive-breadcrumb></ng-reactive-breadcrumb>
        <div class="container">
          <p>Click on the links below and look how the breadcrumb trail changes.</p>
          <ul>
              <li><a [routerLink]="'/one'">One</a></li>
              <li><a [routerLink]="'/one/two'">Two</a></li>
              <li><a [routerLink]="'/one/two/three'">Three</a></li>
              <li><a [routerLink]="'/one/two/three/four'">Four</a></li>
              <li><a [routerLink]="'/one/two/three/four/five'">Five</a></li>
              <li><a [routerLink]="'/one/two/three/four/five/six'">Six</a></li>
              <li><a [routerLink]="'/one/two/three/four/five/six/seven'">Seven</a></li>
          </ul>
          <router-outlet></router-outlet>
          <button class="btn btn-primary" (click)="onClick()">Set name for /seven</button>
        </div>
    `
})
export class AppComponent implements OnInit {
    public ee: EventEmitter<string> = new EventEmitter<string>();

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
                })},
                {path: '/five/six/seven', name: this.ee}
            ]}
        ]);
    }

    onClick() {
        this.ee.emit(Math.random().toFixed(2).toString());
    }
}
