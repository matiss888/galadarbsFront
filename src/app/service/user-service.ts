import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable, Signal } from "@angular/core";
import { Observable } from "rxjs";
import { UserInterface } from "../interface/user-interface";
import { UserExists } from "../globalieSignali/userExists";
import { UserDTO } from "../model/userDTO";


@Injectable({
    providedIn: 'root'
})

export class UserService {
    private readonly URL: string = 'http://localhost:8080/';
    private userAtrada = inject(UserExists)

    private http: HttpClient = inject(HttpClient);

    ielogoties(userDati: UserInterface): Observable<UserDTO> {
        return this.http.post<UserDTO>(`${this.URL}login`, userDati)
    }

    pieregistretUseri(userDati: UserInterface): Observable<UserInterface> {
        return this.http.post<UserInterface>(`${this.URL}user`,userDati);
    }

    mekletUseri(userDati: UserInterface) : Observable<UserInterface> {
        return this.http.post<UserInterface>(`${this.URL}users/search`, userDati)
    }

    // pieteiktiesEventam(user: UserDTO) {
    // return this.http.post<UserDTO>(`${this.URL}home/pievienotUser`, user);
    // }

    // atteiktiesNoEventa(id: any) {
    //     return this.http.delete(`${this.URL}home/izdzestUser/${id}`)
    // }


}