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
import { UserDTO } from '../model/userDTO';
import { JitEvaluator } from '@angular/compiler';

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

  ngOnInit(): void {
    if(!this.logInTrue.userLoggedIn()){
      this.dabutVisusEventus();
      this.router.navigate(['/login']);
    }      
  }
  visiEventiSignals = signal<VisiEventi>({
    visiEventi: [],
  });

  eventSignals = signal<EventInterface>({
    nosaukums: '',
    apraksts: '',
    datums: new Date(),
    laiks: '',
    vieta: '',
    pasreizejaisDalibniekuSkaits: [],
    maxDalibnieki: 0,
    createdBy: 0,
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
      next: atbilde => {
        console.log("Šis nak no dabut visus eventus", atbilde),
        this.visiEventiSignals.update(() => ({
          visiEventi: atbilde}))   
      },
      error: err => console.log(err),
    })
  }

  addEvent() {
    console.log("Tagad signals =", this.eventSignals())
    this.eventForm().value.update(pasreizejais => ({
      ...pasreizejais,
      createdBy: this.logInTrue.loggedInUser().id,
    }))
    console.log("vai te ir users", this.eventForm().value())
    this.eventService.uztaisitEvent(this.eventForm().value()).subscribe({
      next: atbilde => {
        console.log("Subscription atbilde event atbilde", atbilde)
        this.visiEventiSignals.update(pasreizejais => ({
          visiEventi: [...pasreizejais.visiEventi, atbilde],
        }))
      },
        error: err => {
          console.log("Kļūda", err)
      },
    });
    this.dabutVisusEventus();
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

  pieteiktiesEventam(event: EventInterface) {
    const pasreizejaisUserId = this.logInTrue.loggedInUser().id;
    console.log("pasreizejais id:", pasreizejaisUserId);
        if(pasreizejaisUserId == undefined) {
      return;
    }
    if(event.pasreizejaisDalibniekuSkaits.includes(pasreizejaisUserId)|| event.pasreizejaisDalibniekuSkaits.length >= event.maxDalibnieki){
      return;
    } else {
      event.pasreizejaisDalibniekuSkaits.push(pasreizejaisUserId);
    }
    this.eventService.pievienotUseri(event).subscribe({
      next: dati => {
        console.log("atbilde no bakend:", dati)
      },
      error: err => console.log(err)
    })
  }

  
  atrastIstoEventu(event : EventInterface) {
    return event;
    
  }
  atteiktiesNoPasakuma(eventId: number, userId : number) {
    const istaisEventIndex = this.visiEventiSignals().visiEventi.findIndex(event => event.id === eventId)
    console.log("vai es atradu index ?",istaisEventIndex)
    this.eventService.atteiktiesNoPasakuma(eventId, userId).subscribe({
      next: dati => {
      if(istaisEventIndex !== -1) {
        console.log(istaisEventIndex)
        const jaunaisArrajs = [...this.visiEventiSignals().visiEventi];
        jaunaisArrajs.splice(
          istaisEventIndex, 
          1, 
          dati
      )
      this.visiEventiSignals.update(() => ({
        visiEventi: jaunaisArrajs
      }))
      console.log("pec manipulacijam", jaunaisArrajs)}
        console.log("Atteikties no pasakuma: ",dati)
        console.log(dati.pasreizejaisDalibniekuSkaits.length)
        console.log("visieventi length ", this.visiEventiSignals().visiEventi.length)
        console.log("thiseventsignals.pasreizejaisDalibniekuSkaits,", this.eventSignals().pasreizejaisDalibniekuSkaits.length)
      },
      error: err => console.log(err)
    })
  }

  pieteiktiesButtonIsDisabled(event: EventInterface): boolean {
    const pasreizejaisUserId = this.logInTrue.loggedInUser().id;

    if(!pasreizejaisUserId) {
      return true;
    }
    return event.pasreizejaisDalibniekuSkaits.includes(pasreizejaisUserId) ||
         event.pasreizejaisDalibniekuSkaits.length >= event.maxDalibnieki;
  }
}
