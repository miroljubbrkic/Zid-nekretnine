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
  private sellPropSub!: Subscription

  constructor(public sellPropService: SellPropService) {}
  
  
  ngOnInit(): void {
    this.sellPropService.getSellProps()
    this.sellPropSub = this.sellPropService.getSellPropUpdateListener().subscribe((sellProps: SellProp[]) => {
      this.sellProps = sellProps
    })
    
  }

  ngOnDestroy(): void {
    this.sellPropSub.unsubscribe()
  }
}
