import { Component, Injectable, signal } from "@angular/core";
import { UserInterface } from "../interface/user-interface";
import { UserDTO } from "../model/userDTO";

@Injectable({
    providedIn: 'root'
})

export class UserLogInStatus {
    userLoggedIn = signal<boolean>(false);

    loggedInUser = signal<UserDTO>({
        id: 0,
        name: '',
    })
}