import { Component } from '@angular/core';
import { SellProp } from '../sell-prop.model';
import { max, Subscription } from 'rxjs';
import { SellPropService } from '../sell-prop.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sell-prop-list',
  templateUrl: './sell-prop-list.component.html',
  styleUrls: ['./sell-prop-list.component.css']
})
export class SellPropListComponent {

  sellProps: SellProp[] = []
  isLoading = false
  totalProps = 0
  propsPerPage = 2
  currentPage = 1
  pageSizeOptions = [1, 2, 5, 10]
  agentIsAuthenticated = false
  agentId!: string | null
  private sellPropSub!: Subscription
  private authStatusSub!: Subscription


  tipovi = [
    { value: '1', name: 'Stan' },
    { value: '2', name: 'Kuca' },
    { value: '3', name: 'Poslovni prostor' }
  ]

  strukture = [
    { value: '1', name: 'Garsonjera' },
    { value: '2', name: 'Dvosoban' },
    { value: '3', name: 'Trosoban' },
    { value: '4', name: 'Cetvorosoban' },
    { value: '5', name: 'Petosoban' }
  ]

  constructor(public sellPropService: SellPropService, private authService: AuthService) {}
  
  
  ngOnInit(): void {
    this.sellPropService.getSellProps(this.propsPerPage, this.currentPage)
    this.agentId = this.authService.getAgentId()
    this.isLoading = true
    this.sellPropSub = this.sellPropService.getSellPropUpdateListener().subscribe((sellPropData: {sellProps: SellProp[], sellPropsCount: number}) => {
      this.isLoading = false
      this.totalProps = sellPropData.sellPropsCount
      this.sellProps = sellPropData.sellProps
    })
    this.agentIsAuthenticated = this.authService.getIsAuthenticated()
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.agentIsAuthenticated = isAuthenticated
      this.agentId = this.authService.getAgentId()
    })
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true
    this.currentPage = pageData.pageIndex + 1
    this.propsPerPage = pageData.pageSize
    this.sellPropService.getSellProps(this.propsPerPage, this.currentPage)
  }

  getTip(value: string): string {
    const tip = this.tipovi.find(t => t.value === value)
    return tip ? tip.name : value
  }

  getStruktura(value: string): string {
    const struktura = this.strukture.find(s => s.value === value);
    return struktura ? struktura.name : value; // Return the name if found, otherwise return the value
  }

  onDelete(id: string) {
    this.isLoading = true
    this.sellPropService.deleteSellProp(id).subscribe(() => {
      this.totalProps --
      const maxPage = Math.ceil(this.totalProps/this.propsPerPage)
      if (this.currentPage > maxPage) {
        this.currentPage = maxPage > 0 ? maxPage : 1
      }
      this.sellPropService.getSellProps(this.propsPerPage, this.currentPage)
    }, () => {
      this.isLoading = false
    })
  }

  ngOnDestroy(): void {
    this.sellPropSub.unsubscribe()
    this.authStatusSub.unsubscribe()
  }
}
