import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgReactiveBreadCrumbModule } from '../../../src/ng-reactive-breadcrumb';
import { AppComponent } from './components/app.component';
import { TestComponent } from './components/test.component';
import { routing } from './routing';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        NgReactiveBreadCrumbModule,
        routing
    ],
    declarations: [
        AppComponent,
        TestComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {}
