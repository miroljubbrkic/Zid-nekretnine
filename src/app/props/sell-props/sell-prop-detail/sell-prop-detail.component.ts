import { Component, OnInit } from '@angular/core';
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

export class SellPropDetailComponent implements OnInit {
  sellProp!: SellProp;
  isLoading = false;
  agentIsAuthenticated = false
  agentId!: string | null
  private authStatusSub!: Subscription

  constructor(
    private route: ActivatedRoute, 
    private sellPropService: SellPropService, 
    private location: Location,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.agentId = this.authService.getAgentId()
    this.agentIsAuthenticated = this.authService.getIsAuthenticated()
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.agentIsAuthenticated = isAuthenticated
      this.agentId = this.authService.getAgentId()
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        const propId = paramMap.get('id');
        this.isLoading = true;
        if (propId) {
          this.sellPropService.getSellProp(propId).subscribe(propData => {
            this.isLoading = false;
            this.sellProp = propData.sellProp;
          });
        }
      }
    });
    console.log(this.agentIsAuthenticated);
  }

  onBack(): void {
    this.location.back();
  }


  openImageDialog(imgSrc: string): void {
    const initialIndex = this.sellProp.slike.indexOf(imgSrc); // Get the index of the clicked image
    this.dialog.open(ImageDialogComponent, {
      data: { 
        images: this.sellProp.slike, // Pass all images
        initialIndex: initialIndex   // Set the initial index
      },
      width: '600px', // Set a fixed width
      height: '600px', // Set a fixed height
      maxWidth: '90vw', // Optional: to handle small screens
      maxHeight: '90vh', // Optional: to handle small screens
      panelClass: 'custom-dialog-container', // Optional: Custom styles for the dialog
      disableClose: false // Prevents closing the dialog by clicking outside
    });
  }

  onDelete(id: string) {
    this.isLoading = true
    this.sellPropService.deleteSellProp(id).subscribe(() => {
      this.isLoading = false;
      alert('Property deleted successfully!');
      // Navigate back to the list after successful deletion
      this.location.back(); 

    }, error => {
      this.isLoading = false
      console.error('Error deleting property:', error);
      alert('Failed to delete the property.');
    })
  }
  





}
