import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstablishmentPage } from './establishment.page';

describe('EstablishmentPage', () => {
  let component: EstablishmentPage;
  let fixture: ComponentFixture<EstablishmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstablishmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstablishmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
