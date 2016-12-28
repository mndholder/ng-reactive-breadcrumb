import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { BreadCrumbService } from '../services/breadcrumb.service';

@Component({
    selector: 'ng2-reactive-breadcrumb',
    templateUrl: './breadcrumb.component.html'
})
export class BreadCrumbComponent implements OnDestroy {

    private _subscription: Subscription;
    public urls: string[];
    @Input() public min: number = 0;

    constructor(protected _breadCrumbService: BreadCrumbService) {
        this._subscription = this._breadCrumbService.trail
            .subscribe((urls: string[]) => {
                this.urls = urls.length >= this.min ? urls : [];
            });
    }

    getRouteName(url: string): Observable<string> {
        return this._breadCrumbService.getRouteName(url).first();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

}
