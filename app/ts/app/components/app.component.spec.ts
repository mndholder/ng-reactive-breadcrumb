import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('App Component', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AppComponent
            ]
        });
    });

    it('is a fake test', () => {
        expect(true).toBe(true);
    });

});
