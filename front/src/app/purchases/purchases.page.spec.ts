import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PurchasesPage } from './purchases.page';

describe('PurchasesPage', () => {
  let component: PurchasesPage;
  let fixture: ComponentFixture<PurchasesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PurchasesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
