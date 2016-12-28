import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { BreadCrumbService } from '../services/breadcrumb.service';

export class BreadCrumbComponentMetadata {
    selector: string = 'ng2-reactive-breadcrumb';
    template: string = `
        <ol class="mmp-breadcrumbs breadcrumb">
            <li *ngFor="let url of urls; let last = last" [ngClass]="{'active': last}">
                <a role="button" *ngIf="!last" [routerLink]="url">
                    {{getRouteName(url) | async}}
                </a>
                <span *ngIf="last">
                    {{getRouteName(url) | async}}
                </span>
            </li>
        </ol>
    `;
}

@Component(new BreadCrumbComponentMetadata())
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
