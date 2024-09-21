import { Component } from '@angular/core';
import { SellProp } from '../sell-prop.model';
import { Subscription } from 'rxjs';
import { SellPropService } from '../sell-prop.service';

@Component({
  selector: 'app-sell-prop-list',
  templateUrl: './sell-prop-list.component.html',
  styleUrls: ['./sell-prop-list.component.css']
})
export class SellPropListComponent {

  sellProps: SellProp[] = []
  isLoading = false
  private sellPropSub!: Subscription

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

  constructor(public sellPropService: SellPropService) {}
  
  
  ngOnInit(): void {
    this.sellPropService.getSellProps()
    this.isLoading = true
    this.sellPropSub = this.sellPropService.getSellPropUpdateListener().subscribe((sellProps: SellProp[]) => {
      this.isLoading = false
      this.sellProps = sellProps
    })
    
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
    this.sellPropService.deleteSellProp(id)
  }

  ngOnDestroy(): void {
    this.sellPropSub.unsubscribe()
  }
}
