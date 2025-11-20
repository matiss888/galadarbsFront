import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EventInterface } from '../interface/event-interface';
import { Observable } from 'rxjs';
import { VisiEventi } from '../interface/visiEvent-interface';

@Injectable({
  providedIn: 'root',
})

export class EventServices {
  http = inject(HttpClient);

  private readonly URL: string = "http://localhost:8080/"

  uztaisitEvent(event: EventInterface): Observable<EventInterface> { 
    return this.http.post<EventInterface>(`${this.URL}home`, event);
  }
  
  dabutVisusEventus() : Observable<EventInterface[]> {
    return this.http.get<EventInterface[]>(`${this.URL}home`);
  }

  izdzestEventu(id: any) {
    return this.http.delete(`${this.URL}home/${id}`)
  }

}
