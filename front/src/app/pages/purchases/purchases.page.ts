import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.page.html',
  styleUrls: ['./purchases.page.scss'],
})
export class PurchasesPage implements OnInit {
  numbers = [];
  quantity;
  constructor() {
    this.quantity = '1';
  }

  ngOnInit() {
    this.number();
  }

  cantidad() {
    console.log('hace el change')
    console.log(this.quantity)
  }

  number() {
    for (let i = 1; i < 11; i++) {
      this.numbers.push(i);
   }
  }

}
