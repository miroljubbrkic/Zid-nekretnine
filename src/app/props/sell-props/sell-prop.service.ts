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
  private sellPropsUpdated = new Subject<{sellProps: SellProp[], sellPropsCount: number}>()

  constructor(private http: HttpClient, private router: Router) { }
  
  getSellPropUpdateListener() {
    return this.sellPropsUpdated.asObservable()
  }

  getSellProps(propsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${propsPerPage}&page=${currentPage}`
    this.http.get<{message: string, sellPorps: SellProp[], maxProps: number}>('http://localhost:3000/zid/sell-props'+queryParams)
      .subscribe((responseData) => {
        console.log(responseData);
        this.sellProps = responseData.sellPorps
        this.sellPropsUpdated.next({sellProps: [...this.sellProps], sellPropsCount: responseData.maxProps})
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
        this.router.navigate(['/sell-prop-list'])
      })

    }


  deleteSellProp(propId: string) {
    return this.http.delete<{message: string}>('http://localhost:3000/zid/sell-props/' + propId)
  }

}
