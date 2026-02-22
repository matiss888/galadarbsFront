import { Component, inject, signal } from '@angular/core';
import { Header } from '../login-header/header';
import { email, form, maxLength, minLength, required, Field, pattern } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { UserLogInStatus } from '../globalieSignali/userLogInStatus';
import { UserService } from '../service/user-service';
import { UserInterface } from '../interface/user-interface';
import { SignUpClicked } from '../globalieSignali/signUpClicked';
import { LoginRequest } from '../model/login-request';
import { UserRequest } from '../model/user-request';


@Component({
  selector: 'app-login',
  imports: [Header, Field],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone:true,
})
export class Login {

  router = inject(Router);
  logInStatus = inject(UserLogInStatus);
  userService = inject(UserService);
  signUp = inject(SignUpClicked)

  userSignals = signal<UserInterface>({
    name: '',
    password: '',
  });

  userForma = form(this.userSignals, (parametrs) => {
    required(parametrs.name, {message: "Name is required"});
    minLength(parametrs.name, 3, {message: "Name must be atleast 3 letters long"});
    maxLength(parametrs.name, 20, {message: "Shorten your name to fit 20 letters"});
    pattern(parametrs.name, /^[^-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]+$/, {message: "Name can't have any symbols"}) 

    required(parametrs.password, {message: "Password is required"});
    minLength(parametrs.password, 8, {message: "Password must be atleast 8 symbols long"});
    maxLength(parametrs.password, 100, {message: "100 symbols should be safe for a password"});
    pattern(parametrs.password, /[A-Z]/, {message: "Password requires atleast 1 uppercase letter"})
    pattern(parametrs.password, /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/, {message: "Password requires atleast 1 symbol"})   
  });



  logInUser(user: LoginRequest) {
    console.log(user)
    if (this.userForma().valid()) {          
      this.userService.ielogoties(user).subscribe({      
        next: (response) => {
          console.log(response)
          this.logInStatus.loggedInUser.update(() => ({
            name: response.name,
            id: response.id,
          }))
          this.logInStatus.userLoggedIn.set(true);
          this.router.navigate(['/home']);     
          console.log("loginsignals:",this.logInStatus.loggedInUser())         
        },
        error: err => {
          if (err.status == 401) {
            console.error("wrong username or apssword")
          } else {
            console.log("login kļūda", err)
          }  
        }
      });    
    } else {
      console.log("Wrong form");
      return;
    }
  }

  signUpUser(){
    this.signUp.signUpClicked = true;
    if(this.userForma().valid()) {
      this.userService.pieregistretUseri(this.userForma().value() as UserRequest).subscribe({
        next: (atbilde) => {
          console.log("Saglabāts users:", atbilde);
        },
        error: (err) => {
          console.log("Kļūda", err);
        },
      })
    }
  }
}
