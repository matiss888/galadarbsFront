import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable, Signal } from "@angular/core";
import { Observable } from "rxjs";
import { UserInterface } from "../interface/user-interface";
import { UserExists } from "../globalieSignali/userExists";
import { UserDTO } from "../model/userDTO";
import { LoginRequest } from "../model/login-request";
import { UserResponse } from "../model/user-response";
import { UserRequest } from "../model/user-request";


@Injectable({
    providedIn: 'root'
})

export class UserService {
    private readonly URL: string = 'http://localhost:8080/';

    private http: HttpClient = inject(HttpClient);

    ielogoties(userDati: LoginRequest): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.URL}login`, userDati)
    }

    pieregistretUseri(userDati: UserRequest): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.URL}user`,userDati);
    }

    mekletUseri(userDati: UserInterface) : Observable<UserInterface> {
        return this.http.post<UserInterface>(`${this.URL}users/search`, userDati)
    }
}