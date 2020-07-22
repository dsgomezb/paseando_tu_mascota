import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
    {
    path: 'add-address/:id',
    loadChildren: () => import('./pages/address/add-address/add-address.module').then( m => m.AddAddressPageModule)
  },
  {
    path: 'address',
    loadChildren: () => import('./pages/address/address.module').then( m => m.AddressPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'register-client',
    loadChildren: () => import('./pages/register-client/register-client.module').then( m => m.RegisterClientPageModule)
  },
  {
    path: 'purchases',
    loadChildren: () => import('./pages/purchases/purchases.module').then( m => m.PurchasesPageModule)
  },  {
    path: 'mypets',
    loadChildren: () => import('./pages/mypets/mypets.module').then( m => m.MypetsPageModule)
  }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
