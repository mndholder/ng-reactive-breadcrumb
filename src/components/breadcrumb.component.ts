import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { BreadCrumbService } from '../services/breadcrumb.service';

/**
 * Component metadata class.
 * This class can be extended and then use to extend the built-in component
 */
export class BreadCrumbComponentMetadata {
    /**
     * Standard angular selector property. Change to whatever you desire
     * @type {string}
     */
    selector: string = 'ng-reactive-breadcrumb';
    /**
     * Standard Angular template property. Change to whatever you desire
     * @type {string}
     */
    template: string = `
        <ol class="breadcrumb">
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

/**
 * Breadcrumb component.
 * Simple built-in component to render breadcrumb trail
 */
@Component(new BreadCrumbComponentMetadata())
export class BreadCrumbComponent implements OnDestroy {

    /**
     * Private property to hold trail subscription
     */
    private _subscription: Subscription;
    /**
     * Current trail as an array of strings. For example ['first', 'first/second', 'first/secons/third']
     */
    public urls: string[];
    /**
     * Input property which limits the trail to the minimum number of entries to fill in the urls property
     * @type {number}
     */
    @Input() public min: number = 0;

    /**
     * Component constructor. Subscribes to the breadcrumb trail
     * @param _breadCrumbService BreadCrumb service which will fire trail changes
     */
    constructor(
        protected _breadCrumbService: BreadCrumbService
    ) {
        this._subscription = this._breadCrumbService.trail
            .subscribe((urls: string[]) => {
                this.urls = urls.length >= this.min ? urls : [];
            });
    }

    /**
     * Method allows to receive a route name
     * @param url Route(Path) to receive the name of
     * @returns {Observable<any>} Name as an Observable which you will have to subscribe to
     */
    getRouteName(url: string): Observable<string> {
        return this._breadCrumbService.getRouteName(url);
    }

    /**
     * Destroy method. Unsubscribes from the breadcrumb trail
     */
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

}
