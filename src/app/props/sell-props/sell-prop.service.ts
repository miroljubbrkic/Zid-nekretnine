import { Injectable } from '@angular/core';
import { SellProp } from './sell-prop.model';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Agent } from 'src/app/auth/agent.model';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SellPropService {

  private sellProps: SellProp[] = [];
  private sellPropsUpdated = new Subject<{ sellProps: SellProp[], sellPropsCount: number }>();

  constructor(private http: HttpClient, private router: Router, private location: Location) { }

  getAgentById(agentId: string): Observable<{ message: string, agent: Agent }> {
    return this.http.get<{ message: string, agent: Agent }>(`http://localhost:3000/api/agents/${agentId}`);
  }

  getSellPropUpdateListener() {
    return this.sellPropsUpdated.asObservable();
  }

  getSellProp(id: string) {
      return this.http.get<{ sellProp: SellProp }>('http://localhost:3000/zid/sell-props/' + id);
  }


  getSellProps(
    propsPerPage: number | null,
    currentPage: number | null,
    minCena?: number | null,
    maxCena?: number | null,
    minPovrsina?: number | null,
    maxPovrsina?: number | null,
    struktura?: string | null
  ) {
    let queryParams = `?pagesize=${propsPerPage}&page=${currentPage}`;

    if (minCena !== undefined && minCena !== null) {
      queryParams += `&minCena=${minCena}`;
    }
    if (maxCena !== undefined && maxCena !== null) {
      queryParams += `&maxCena=${maxCena}`;
    }
    if (minPovrsina !== undefined && minPovrsina !== null) {
      queryParams += `&minPovrsina=${minPovrsina}`;
    }
    if (maxPovrsina !== undefined && maxPovrsina !== null) {
      queryParams += `&maxPovrsina=${maxPovrsina}`;
    }
    if (struktura) {
      queryParams += `&struktura=${struktura}`;
    }

    this.http
      .get<{ message: string, sellPorps: SellProp[], maxProps: number }>('http://localhost:3000/zid/sell-props' + queryParams)
      .subscribe((responseData) => {
        this.sellProps = responseData.sellPorps;
        this.sellPropsUpdated.next({
          sellProps: [...this.sellProps],
          sellPropsCount: responseData.maxProps
        });
      });
  }

  

  getMySellProps(
    propsPerPage: number | null,
    currentPage: number | null,
    minCena?: number | null,
    maxCena?: number | null,
    minPovrsina?: number | null,
    maxPovrsina?: number | null,
    struktura?: string | null
  ) {

    let queryParams = `?pagesize=${propsPerPage}&page=${currentPage}`;

    if (minCena !== undefined && minCena !== null) {
      queryParams += `&minCena=${minCena}`;
    }
    if (maxCena !== undefined && maxCena !== null) {
      queryParams += `&maxCena=${maxCena}`;
    }
    if (minPovrsina !== undefined && minPovrsina !== null) {
      queryParams += `&minPovrsina=${minPovrsina}`;
    }
    if (maxPovrsina !== undefined && maxPovrsina !== null) {
      queryParams += `&maxPovrsina=${maxPovrsina}`;
    }
    if (struktura) {
      queryParams += `&struktura=${struktura}`;
    }




    return this.http
      .get<{ message: string; sellProps: SellProp[] }>('http://localhost:3000/zid/sell-props/my-sell-props' + queryParams)
      .subscribe((responseData) => {
        this.sellProps = responseData.sellProps;
        this.sellPropsUpdated.next({
          sellProps: [...this.sellProps],
          sellPropsCount: this.sellProps.length
        });
      });
  }

  addSellProp(
    naslov: string,
    tip: string,
    struktura: string,
    grad: string,
    naselje: string,
    adresa: string,
    povrsina: number,
    cena: number,
    spratovi: number,
    sprat: number,
    lift: boolean,
    grejanje: number,
    namestenost: boolean,
    uknjizenost: boolean,
    slike: File[],
    opis: string
  ) {
    const newSellProp = new FormData();
    newSellProp.append('naslov', naslov);
    newSellProp.append('tip', tip);
    newSellProp.append('struktura', struktura);
    newSellProp.append('grad', grad);
    newSellProp.append('naselje', naselje);
    newSellProp.append('adresa', adresa);
    newSellProp.append('povrsina', povrsina.toString());
    newSellProp.append('cena', cena.toString());
    newSellProp.append('spratovi', spratovi.toString());
    newSellProp.append('sprat', sprat.toString());
    newSellProp.append('lift', lift.toString());
    newSellProp.append('grejanje', grejanje.toString());
    newSellProp.append('namestenost', namestenost.toString());
    newSellProp.append('uknjizenost', uknjizenost.toString());
    newSellProp.append('opis', opis);

    if (slike) {
      slike.forEach((file, index) => {
        newSellProp.append('slike', file, Date.now() + '-' + file.name.split('.')[0] + '-' + index); // Append files with unique names
      });
    }

    this.http.post<{ message: string, sellProp: SellProp }>('http://localhost:3000/zid/sell-props', newSellProp)
      .subscribe(() => {
        this.router.navigate(['/oglasi-za-prodaju']);
      });
  }

  updateSellProp(
    id: string,
    naslov: string,
    tip: string,
    struktura: string,
    grad: string,
    naselje: string,
    adresa: string,
    povrsina: number,
    cena: number,
    spratovi: number,
    sprat: number,
    lift: boolean,
    grejanje: number,
    namestenost: boolean,
    uknjizenost: boolean,
    slike: { oldImages: string[], newImages: File[] },
    opis: string
  ) {
    const formData = new FormData();
    formData.append('naslov', naslov);
    formData.append('tip', tip);
    formData.append('struktura', struktura);
    formData.append('grad', grad);
    formData.append('naselje', naselje);
    formData.append('adresa', adresa);
    formData.append('povrsina', povrsina.toString());
    formData.append('cena', cena.toString());
    formData.append('spratovi', spratovi.toString());
    formData.append('sprat', sprat.toString());
    formData.append('lift', lift.toString());
    formData.append('grejanje', grejanje.toString());
    formData.append('namestenost', namestenost.toString());
    formData.append('uknjizenost', uknjizenost.toString());
    formData.append('opis', opis);

    // Append existing images (URLs)
    slike.oldImages.forEach((imageUrl: string) => {
      formData.append('existingImages', imageUrl);
    });

    // Append new image files to FormData
    if (slike.newImages) {
      slike.newImages.forEach((file: File, index: number) => {
        formData.append('slike', file, Date.now() + '-' + file.name.split('.')[0] + '-' + index);
      });
    }

    this.http.put('http://localhost:3000/zid/sell-props/' + id, formData)
      .subscribe(() => {
        // this.router.navigate(['/oglasi-za-prodaju']);
        this.location.back
      });
  }

  deleteSellProp(propId: string) {
    return this.http.delete<{ message: string }>('http://localhost:3000/zid/sell-props/' + propId);
  }

}
