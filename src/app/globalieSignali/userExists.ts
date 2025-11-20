import { Component, Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class UserExists {
    userExists = signal<boolean>(false);
}