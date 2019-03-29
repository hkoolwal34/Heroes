import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

//Importing HttpClient for client interaction
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {catchError,map,tap} from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class HeroService {

	//header that is necesssary for saving content on server
	// this is one of the parameter in http.put
	
	private heroesUrl = 'api/heroes'; // URL to the web api
	
	
  constructor(
	private messageService: MessageService,
	private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {

    this.messageService.add('HeroService: fetched heroes');
//    return of(HEROES);
	return this.http.get<Hero[]>(this.heroesUrl)
	.pipe(
		tap(_ => this.log('fetched heroes')),
		catchError(this.handleError<Hero[]>('getHeroes',[]))
	);
  }
  
	//Updates the Hero on the webpage
	updateHero (hero: Hero): Observable<any> {
	  return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
		tap(_ => this.log(`updated hero id=${hero.id}`)),
		catchError(this.handleError<any>('updateHero'))
	  );
	}
  
	getHero(id:number): Observable<Hero>{
		const url = `${this.heroesUrl}/${id}`;
		return this.http.get<Hero>(url).pipe(
			tap(_ => this.log(`fetched hero id = ${id}`)),
			catchError(this.handleError<Hero>(`getHero id=${id}`))
		);
	}
	
	addHero(hero : string): Observable<Hero>{
		return this.http.post<Hero>(this.heroesUrl,hero,httpOptions).pipe(
			tap((newHero : Hero)=>this.log(`added Hero with id = ${newHero.id}`)),
			catchError(this.handleError<Hero>('addHero'))
		);
	}
	
	deleteHero(hero : Hero|number): Observable<Hero>{
		const id = typeof hero ==='number'?hero:hero.id;
		const url = `${this.heroesUrl}/${id}`;
		
		return this.http.delete<Hero>(url,httpOptions).pipe(
			tap(_ => this.log(`deleted hero id = ${id}`)),
			catchError(this.handleError<Hero>('deleteHero'))
		);
	}
	
	searchHeroes(term: string):Observable<Hero[]>{
		if(!term.trim())//empty search
		{
			return of([]);
		}
		return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
			tap(_ => this.log(`found heroes matching the term "${term}"`)),
			catchError(this.handleError<Hero[]>('searchHeroes',[]))
		);
	}
	
  
  
 /* 
  getHero(id : number): Observable<Hero>{
	  this.messageService.add(`HeroService:fetched hero id =${id}`);
	  return of(HEROES.find(hero=>hero.id === id));
  }*/
  
  //handling error for all the Heroservice methods so that the application 
  //keeps on working
  private handleError<T> (operation = 'operation',result?:T){
	  return (error:any): Observable<T> => {
			console.error(error);
			this.log(`${operation} failed : ${error.message}`);
			
			return of(result as T);
	  };
  }
  
  
  private log(message : string){
	  this.messageService.add(`HeroService : ${message}`);
  }
}
