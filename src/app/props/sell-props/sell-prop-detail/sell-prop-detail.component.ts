import { Component, OnInit, OnDestroy } from '@angular/core';
import { SellProp } from '../sell-prop.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SellPropService } from '../sell-prop.service';
import { Location } from '@angular/common';
import { ImageDialogComponent } from '../../image-dialog/image-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sell-prop-detail',
  templateUrl: './sell-prop-detail.component.html',
  styleUrls: ['./sell-prop-detail.component.css']
})
export class SellPropDetailComponent implements OnInit, OnDestroy {
  sellProp!: SellProp;
  agentDetails!: any;
  isLoading = false;
  agentIsAuthenticated = false;
  agentId!: string | null;
  private authStatusSub!: Subscription;

  // Grejanje options map
  grejanje = [
    { value: 'centralno', name: 'Centralno' },
    { value: 'etazno', name: 'Etažno' },
    { value: 'podno', name: 'Podno' },
    { value: 'ta_pec', name: 'TA peć' },
    { value: 'struja', name: 'Struja' }
  ];

  constructor(
    private route: ActivatedRoute,
    private sellPropService: SellPropService,
    private location: Location,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get agent details and authentication status
    this.agentId = this.authService.getAgentId();
    this.agentIsAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.agentIsAuthenticated = isAuthenticated;
      this.agentId = this.authService.getAgentId();
    });

    // Fetch property details based on route params
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        const propId = paramMap.get('id');
        this.isLoading = true;
        if (propId) {
          this.sellPropService.getSellProp(propId).subscribe(propData => {
            this.isLoading = false;
            this.sellProp = propData.sellProp;

            if (this.sellProp.agent) {
              this.fetchAgentDetails(this.sellProp.agent)
            }
          });
        }
      }
    });
  }

  fetchAgentDetails(agentId: string): void {
    this.authService.getAgentById(agentId).subscribe(response => {
      this.agentDetails = response.agent;
    }, error => {
      console.error('Failed to fetch agent details', error);
    });
  }

  // Go back to the previous page
  onBack(): void {
    this.location.back();
  }

  // Open image dialog to view property images
  openImageDialog(imgSrc: string): void {
    const initialIndex = this.sellProp.slike.indexOf(imgSrc); // Get the index of the clicked image
    this.dialog.open(ImageDialogComponent, {
      data: { 
        images: this.sellProp.slike, // Pass all images
        initialIndex: initialIndex   // Set the initial index
      },
      width: '600px',
      height: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      disableClose: false
    });
  }

  // Delete property
  onDelete(id: string): void {
    this.isLoading = true;
    this.sellPropService.deleteSellProp(id).subscribe(() => {
      this.isLoading = false;
      alert('Property deleted successfully!');
      this.location.back(); // Navigate back to the list after deletion
    }, error => {
      this.isLoading = false;
      console.error('Error deleting property:', error);
      alert('Failed to delete the property.');
    });
  }

  // Map grejanje value to its name
  getGrejanje(value: string): string {
    const grejanje = this.grejanje.find(g => g.value === value);
    return grejanje ? grejanje.name : 'Nepoznato';
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.authStatusSub.unsubscribe();
  }
}
