import { Component, inject, OnInit, signal } from '@angular/core';
import { UserLogInStatus } from '../globalieSignali/userLogInStatus';
import { Router } from '@angular/router';
import { UserService } from '../service/user-service';
import { EventInterface } from '../interface/event-interface';
import { Field, form, required } from '@angular/forms/signals';
import { EventServices } from '../service/event-services';
import { DatePipe, formatDate } from '@angular/common';
import { VisiEventi } from '../interface/visiEvent-interface';
import { HomeHeader } from "../home-header/home-header";
import { Login } from '../login/login';

@Component({
  selector: 'app-home',
  imports: [Field, DatePipe, HomeHeader],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  eventService = inject(EventServices)
  logInTrue = inject(UserLogInStatus);
  router = inject(Router);
  userService = inject(UserService);

  // ngOnInit(): void {
  //   if(!this.logInTrue.userLoggedIn()){
  //     this.dabutVisusEventus();
  //     // this.router.navigate(['/login']);
  //   }      
  // }
  visiEventiSignals = signal<VisiEventi>({
    visiEventi: [],
  });

  eventSignals = signal<EventInterface>({
    nosaukums: '',
    apraksts: '',
    datums: new Date(),
    laiks: '',
    vieta: '',
    paslaikPieteikusies: 0,
    maxDalibnieki: 0,
    uztaisijaEventu: 0,
  });

  
  eventForm = form(this.eventSignals, (jebkas)=> {
    required(jebkas.nosaukums, { message: "Obligāti jāievada nosaukums!"});
    required(jebkas.apraksts, { message: "Obligāti jāievada apraksts!"});
    required(jebkas.datums, { message: "Obligāti jāievada datums!"});
    required(jebkas.laiks, { message: "Obligāti jāievada laiks!"});
    required(jebkas.vieta, { message: "Obligāti jāievada vieta!"});
    required(jebkas.maxDalibnieki, { message: "Obligāti jāievada maxDalibnieki!"});
  });

  today = new Date(); 

  dabutVisusEventus() {
    this.eventService.dabutVisusEventus().subscribe({
      next: (p) => {
        console.log("Manieventi", p)
        this.visiEventiSignals.set({visiEventi:p});
      },
      error: (err) => console.log("rr", err),
    })
  }

  addEvent() {
    this.eventService.uztaisitEvent(this.eventForm().value()).subscribe({
      next: atbilde => {
        console.log("Subscription atbilde event atbilde", atbilde)       
      },
        error: err => {
          console.log("Kļūda", err)
      },
    });
  }

  izdzestEventu(id?: any) {
    if (!id) return;
    this.eventService.izdzestEventu(id).subscribe({
      next: dati => console.log("Šis id ir izdzēsts", dati),
      error: err => console.log("izdzēst kķluda:", err)
    })
        this.visiEventiSignals.update((current) => ({
      visiEventi: current.visiEventi.filter(e => e.id !== id)
    }))
  }

}
