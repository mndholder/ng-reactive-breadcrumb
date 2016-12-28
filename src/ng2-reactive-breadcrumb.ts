import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BreadCrumbComponent } from './components/breadcrumb.component';
import { BreadCrumbService } from './services/breadcrumbs.service';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        RouterModule.forChild([])
    ],
    declarations: [
        BreadCrumbComponent
    ],
    providers: [
        BreadCrumbService
    ],
    exports: [
        BreadCrumbComponent
    ]
})
export class Ng2ReactiveBreadCrumbModule {}

export * from './components/breadcrumb.component';
export * from './services/breadcrumbs.service';
