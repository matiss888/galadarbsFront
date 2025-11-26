import { Component, inject } from '@angular/core';
import { Login } from '../login/login';
import { UserLogInStatus } from '../globalieSignali/userLogInStatus';

@Component({
  selector: 'app-home-header',
  imports: [],
  templateUrl: './home-header.html',
  styleUrl: './home-header.css',
})
export class HomeHeader {

  logInStatus = inject(UserLogInStatus);


}
