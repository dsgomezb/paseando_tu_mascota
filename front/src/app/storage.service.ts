import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  token_user;
  constructor() { }

  openUser(){
    this.token_user = '';
  }
}
