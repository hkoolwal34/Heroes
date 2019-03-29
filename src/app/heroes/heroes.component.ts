import { Component, OnInit } from '@angular/core';
import {Hero} from '../hero';
import {HeroService} from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

	heroes: Hero[];


	constructor(private heroService : HeroService) { }
	
	getHeroes():void{
//		this.heroes = this.heroService.getHeroes();
		this.heroService.getHeroes()
			.subscribe(heroes => this.heroes = heroes);
	}

	add(name : String) : void{
		name = name.trim(); // to remove unnecessary white space in the 
		//beginning and the end
		
		if(!name){
			// name field is empty
			return;
		}
		this.heroService.addHero({name} as Hero) // giving type along with the variable
			.subscribe(hero => {
				this.heroes.push(hero);
			});
		
	}
	
	delete(hero : Hero):void{
		this.heroes = this.heroes.filter(h=>h!==hero);
		//just remove the visibility of the deleted hero first.
		this.heroService.deleteHero(hero).subscribe();
	}

	ngOnInit() {
		this.getHeroes();
	}

}
