import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeroeModel } from '../Models/heroe.model';
import {map, delay} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private url ='https://login-app-4779b-default-rtdb.firebaseio.com';

  constructor( private http: HttpClient) { }

  crearHeroe(heroe: HeroeModel){
     
    return this.http.post(`${this.url}/heroes.json`, heroe)
      .pipe(
        map( (resp:any) => {
          heroe.id = resp.name;
          return heroe;
        })
      );

  }

  actualizarHeroe(heroe: HeroeModel){
   const heroeTemp= {
     ...heroe 
     //esto se utiliza para colocar todas las propiedades del heroe y
     // no tener que colocarlas una por una, ademas de saltar la referencia de JS para poder ejecutar
     //el delete antes de enviar el put para que no se repita el id y se confunda el firebase
   };

   delete heroeTemp.id;
    //el put funciona enviando la actualizacion directamente al archivo del heroe ya creado con el heroe id 
    return this.http.put(`${this.url}/heroes/${heroe.id}.json`, heroeTemp)
  }

  borrarHeroe(id:any){
    return this.http.delete(`${this.url}/heroes/${ id }.json`);
  }



  getHeroe (id:string){
    return this.http.get(`${this.url}/heroes/${ id }.json`)
  }

  //metodo que utilizamos para acceder a todos los heroes para la tabla del home
  getHeroes(){
    return this.http.get(`${this.url}/heroes.json`)
     .pipe(
       map(this.crearArreglo),
       delay(1500)
     );
  }

  private crearArreglo(heroesObj: any){
    
    const heroes: HeroeModel[] = [];

    console.log(heroesObj);

     if (heroesObj === null ){ return[];}

     Object.keys(heroesObj).forEach(key => {
            //key es el brindado por el firebase (el id que titula el objeto)
      const heroe: HeroeModel = heroesObj[key];
      heroe.id= key;

      heroes.push(heroe);
     });

    return heroes;

  }

}
