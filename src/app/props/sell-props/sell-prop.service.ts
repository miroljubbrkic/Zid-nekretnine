import { Injectable } from '@angular/core';
import { SellProp } from './sell-prop.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SellPropService {

  private sellProps: SellProp[] = []
  private sellPropsUpdated = new Subject<SellProp[]>()

  constructor(private http: HttpClient, private router: Router) { }
  
  getSellPropUpdateListener() {
    return this.sellPropsUpdated.asObservable()
  }

  getSellProps() {
    this.http.get<{message: string, sellPorps: SellProp[]}>('http://localhost:3000/zid/sell-props').subscribe((responseData) => {
      this.sellProps = responseData.sellPorps
      this.sellPropsUpdated.next([...this.sellProps])
    })
  }

  getSellProp(id: string) {
    return this.http.get<{sellProp:SellProp}>('http://localhost:3000/zid/sell-props/' + id)
  }


  addSellProp(
    tip: string, 
    povrsina: number, 
    cenaKvadrata: number, 
    struktura: string, 
    sprat: number, 
    brojSpavacihSoba: number,
    slike: File[],
    opis: string) {

      // const newSellProp: SellProp = {
      //   _id: 'null',
      //   tip: tip,
      //   povrsina: povrsina,
      //   cenaKvadrata: cenaKvadrata,
      //   struktura: struktura,
      //   sprat: sprat,
      //   brojSpavacihSoba: brojSpavacihSoba,
      //   opis: opis
      // }

      const newSellProp = new FormData()
      newSellProp.append('tip', tip),
      newSellProp.append('povrsina', povrsina.toString())
      newSellProp.append('cenaKvadrata', cenaKvadrata.toString())
      newSellProp.append('struktura', struktura)
      newSellProp.append('sprat', sprat.toString())
      newSellProp.append('brojSpavacihSoba', brojSpavacihSoba.toString())
      newSellProp.append('opis', opis)
      slike.forEach((file, index) => {
        newSellProp.append('slike', file, Date.now() + '-' + file.name.split('.')[0] + '-' + index); // Append files with unique names
      });

      
      
      this.http.post<{message: string, sellProp: SellProp}>('http://localhost:3000/zid/sell-props', newSellProp).subscribe((responseData) => {
        const tempSellProp: SellProp = {
          _id: responseData.sellProp._id,
          tip: tip,
          povrsina: povrsina,
          cenaKvadrata: cenaKvadrata,
          struktura: struktura,
          sprat: sprat,
          brojSpavacihSoba: brojSpavacihSoba,
          slike: responseData.sellProp.slike,
          opis: opis
        }

        console.log(responseData.message);
        this.sellProps.push(tempSellProp)
        this.sellPropsUpdated.next([...this.sellProps])
        this.router.navigate(['/sell-prop-list'])
      })
  }

  updateSellProp(
    id: string, 
    tip: string, 
    povrsina: number, 
    cenaKvadrata: number, 
    struktura: string, 
    sprat: number, 
    brojSpavacihSoba: number, 
    slike: any,
    opis: string
  ) {
      
      const formData = new FormData();
      formData.append('tip', tip);
      formData.append('povrsina', povrsina.toString());
      formData.append('cenaKvadrata', cenaKvadrata.toString());
      formData.append('struktura', struktura);
      formData.append('sprat', sprat.toString());
      formData.append('brojSpavacihSoba', brojSpavacihSoba.toString());
      formData.append('opis', opis);

      slike.oldImages.forEach((imageUrl: string) => {
        formData.append('existingImages', imageUrl);
      });

      // Append new image files to FormData
      if (slike.newImages) {
        slike.newImages.forEach((file: File, index: number) => {
          formData.append('slike', file, Date.now() + '-' + file.name.split('.')[0] + '-' + index);
        });
      }

      this.http.put('http://localhost:3000/zid/sell-props/' + id, formData).subscribe(response => {
        const updatedSellProps = [...this.sellProps]
        const oldSellPropIndex = updatedSellProps.findIndex(p => p._id === id)
        const tempSellProp: SellProp = {
          _id: id,
          tip: tip,
          povrsina: povrsina,
          cenaKvadrata: cenaKvadrata,
          struktura: struktura,
          sprat: sprat,
          brojSpavacihSoba: brojSpavacihSoba,
          slike: [...slike.oldImages, ...slike.newImages],
          opis: opis
        }
        updatedSellProps[oldSellPropIndex] = tempSellProp
        this.sellProps = updatedSellProps
        this.sellPropsUpdated.next([...this.sellProps])
        this.router.navigate(['/sell-prop-list'])
      })

    }

  deleteSellProp(propId: string) {
    this.http.delete<{message: string}>('http://localhost:3000/zid/sell-props/' + propId).subscribe((responseData) => {
      console.log(responseData.message);
      const updatedSellProps = this.sellProps.filter((prop) => prop._id !== propId)
      this.sellProps = updatedSellProps
      this.sellPropsUpdated.next(this.sellProps)
    })
  }


}
