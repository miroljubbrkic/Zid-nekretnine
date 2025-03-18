import { Component } from '@angular/core';
import { SellProp } from '../sell-prop.model';
import { max, Subscription } from 'rxjs';
import { SellPropService } from '../sell-prop.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-sell-prop-list',
  templateUrl: './sell-prop-list.component.html',
  styleUrls: ['./sell-prop-list.component.css']
})
export class SellPropListComponent {

  sellProps: SellProp[] = []
  isLoading = false
  totalProps = 0
  propsPerPage = 5
  currentPage = 1
  pageSizeOptions = [1, 2, 5, 10]
  agentIsAuthenticated = false
  agentId!: string | null
  private sellPropSub!: Subscription
  private authStatusSub!: Subscription

  minCena!: number | null;
  maxCena!: number | null;
  minPovrsina!: number | null;
  maxPovrsina!: number | null;
  selectedStruktura!: string | null


  tipovi = [
    { value: 'Stan', name: 'Stan' },
    { value: 'Kuca', name: 'Kuca' },
    { value: 'Poslovni prostor', name: 'Poslovni prostor' }
  ];

  strukture = [
    { value: 'Garsonjera', name: 'Garsonjera' },
    { value: 'Dvosoban', name: 'Dvosoban' },
    { value: 'Trosoban', name: 'Trosoban' },
    { value: 'Četvorosoban', name: 'Četvorosoban' },
    { value: 'Petosoban', name: 'Petosoban' }
  ];

  grejanja = [
    { value: 'centralno', name: 'Centralno' },
    { value: 'etazno', name: 'Etažno' },
    { value: 'podno', name: 'Podno' },
    { value: 'ta_pec', name: 'TA peć' },
    { value: 'struja', name: 'Struja' }
  ];
  

  constructor(
    public sellPropService: SellPropService, 
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  
  ngOnInit(): void {

    this.route.url.subscribe(url => {
      const isMySellPropsList = url[0] && url[0].path === 'moji-oglasi'

      if (isMySellPropsList) {
        this.route.queryParams.subscribe((params: Params) => {
          this.minCena = params['minCena'] || null;
          this.maxCena = params['maxCena'] || null;
          this.minPovrsina = params['minPovrsina'] || null;
          this.maxPovrsina = params['maxPovrsina'] || null;
          this.selectedStruktura = params['struktura'] || null;
          this.currentPage = +params['page'] || this.currentPage;
          this.propsPerPage = +params['pageSize'] || this.propsPerPage;
          this.getMySellProps()

        })

      } else {

        // Subscribe to query params to get initial filter values
        this.route.queryParams.subscribe((params: Params) => {
          this.minCena = params['minCena'] || null;
          this.maxCena = params['maxCena'] || null;
          this.minPovrsina = params['minPovrsina'] || null;
          this.maxPovrsina = params['maxPovrsina'] || null;
          this.selectedStruktura = params['struktura'] || null;
          this.currentPage = +params['page'] || this.currentPage;
          this.propsPerPage = +params['pageSize'] || this.propsPerPage;
          
          this.getSellProps();
        });

      }



    })


    

    this.agentId = this.authService.getAgentId();
    this.isLoading = true;
    
    this.sellPropSub = this.sellPropService.getSellPropUpdateListener().subscribe((sellPropData: {sellProps: SellProp[], sellPropsCount: number}) => {
      this.isLoading = false;
      this.totalProps = sellPropData.sellPropsCount;
      this.sellProps = sellPropData.sellProps;
    });
    this.agentIsAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.agentIsAuthenticated = isAuthenticated;
      this.agentId = this.authService.getAgentId();
    });
  }

  getSellProps() {
    this.isLoading = true;
    this.sellPropService.getSellProps(
      this.propsPerPage, 
      this.currentPage, 
      this.minCena, 
      this.maxCena,
      this.minPovrsina,
      this.maxPovrsina,
      this.selectedStruktura
    );
  }

  getMySellProps() {
    this.isLoading = true
    this.sellPropService.getMySellProps(
      this.propsPerPage, 
      this.currentPage, 
      this.minCena, 
      this.maxCena,
      this.minPovrsina,
      this.maxPovrsina,
      this.selectedStruktura
    )
  }

  onSearch() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        minCena: this.minCena,
        maxCena: this.maxCena,
        minPovrsina: this.minPovrsina,
        maxPovrsina: this.maxPovrsina,
        struktura: this.selectedStruktura,
        page: 1, // Reset to first page when new search is performed
        pageSize: this.propsPerPage
      },
      queryParamsHandling: 'merge'
    });
  }

  onReset() {
    this.minCena = null;
    this.maxCena = null;
    this.minPovrsina = null;
    this.maxPovrsina = null;
    this.selectedStruktura = null;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: 'merge'
    });
  }



  onCardClick(propId: string) {
    this.router.navigate(['/oglasi-za-prodaju', propId]);
  }

  onChangePage(pageData: PageEvent) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: pageData.pageIndex + 1,
        pageSize: pageData.pageSize,
        minCena: this.minCena,
        maxCena: this.maxCena,
        minPovrsina: this.minPovrsina,
        maxPovrsina: this.maxPovrsina
      },
      queryParamsHandling: 'merge'
    });
  }

  getTip(value: string): string {
    const tip = this.tipovi.find(t => t.value === value)
    return tip ? tip.name : value
  }

  getStruktura(value: string): string {
    const struktura = this.strukture.find(s => s.value === value);
    return struktura ? struktura.name : value; // Return the name if found, otherwise return the value
  }

  getGrejanje(value: string): string {
    const grejanje = this.grejanja.find(g => g.value === value);
    return grejanje ? grejanje.name : value; // Return the name if found, otherwise 'Nepoznato'
  }
  

  // onDelete(id: string) {
  //   this.isLoading = true
  //   this.sellPropService.deleteSellProp(id).subscribe(() => {
  //     this.totalProps --
  //     const maxPage = Math.ceil(this.totalProps/this.propsPerPage)
  //     if (this.currentPage > maxPage) {
  //       this.currentPage = maxPage > 0 ? maxPage : 1
  //     }
  //     this.sellPropService.getSellProps(this.propsPerPage, this.currentPage)
  //   }, () => {
  //     this.isLoading = false
  //   })
  // }

  onDelete(id: string) {
    this.isLoading = true;
    this.sellPropService.deleteSellProp(id).subscribe(() => {
      this.totalProps--;
      const maxPage = Math.ceil(this.totalProps / this.propsPerPage);
      if (this.currentPage > maxPage) {
        this.currentPage = maxPage > 0 ? maxPage : 1;
      }
      this.getSellProps();
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.sellPropSub.unsubscribe()
    this.authStatusSub.unsubscribe()
  }
}
