import { Injectable } from '@angular/core';
import { SellProp } from './sell-prop.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SellPropService {

  tempSellProp: SellProp = {
    _id: 'ootut99', tip: '1', povrsina:45, cenaKvadrata: 2000, struktura: 'dvosoban', sprat: 2, brojSpavacihSoba: 2, opis: 'qwer'
  }
  private sellProps: SellProp[] = []
  private sellPropsUpdated = new Subject<SellProp[]>()

  constructor(private http: HttpClient) { }

  getSellProps() {
    this.http.get<{message: string, sellPorps: SellProp[]}>('http://localhost:3000/zid/sell-props').subscribe((responseData) => {
      this.sellProps = responseData.sellPorps
      this.sellPropsUpdated.next([...this.sellProps])
    })
  }

  getSellPropUpdateListener() {
    return this.sellPropsUpdated.asObservable()
  }

  addSellProp(
    tip: string, 
    povrsina: number, 
    cenaKvadrata: number, 
    struktura: string, 
    sprat: number, 
    brojSpavacihSoba: number, 
    opis: string) {

      const newSellProp: SellProp = {
        _id: null,
        tip: tip,
        povrsina: povrsina,
        cenaKvadrata: cenaKvadrata,
        struktura: struktura,
        sprat: sprat,
        brojSpavacihSoba: brojSpavacihSoba,
        opis: opis
      }
      
      this.http.post<{message: string}>('http://localhost:3000/zid/sell-props', newSellProp).subscribe((responseData) => {
        console.log(responseData.message);
        this.sellProps.push(newSellProp)
        this.sellPropsUpdated.next([...this.sellProps])
      })

  }
}
