import { Component, Injectable, signal } from "@angular/core";
import { UserInterface } from "../interface/user-interface";

@Injectable({
    providedIn: 'root'
})

export class UserLogInStatus {
    userLoggedIn = signal<boolean>(false);

    loggedInUser = signal<string>('')
}