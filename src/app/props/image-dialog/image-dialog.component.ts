import { Component, Inject, ElementRef, ViewChild, HostListener, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { AuthService } from '../auth.service'; // Import your AuthService to get agent information
import { Router } from '@angular/router'; // Import Router to navigate to edit page
import { AuthService } from 'src/app/auth/auth.service';
import { SellPropService } from '../sell-props/sell-prop.service';
// import { SellPropService } from '../sell-prop.service'; // Import your SellPropService to delete the property

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.css']
})
export class ImageDialogComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContainer', { static: false }) dialogContainer!: ElementRef; // Reference to the dialog container
  currentIndex = 0; // Track the current image index
  isFullscreen = false; // Track fullscreen state
  agentIsAuthenticated = false; // Track if the agent is authenticated
  loggedInAgentId!: string | null; // Store the logged-in agent's ID

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { images: string[], initialIndex: number, agentId: string, propId: string },
    private renderer: Renderer2,
    private authService: AuthService, // Inject AuthService to check authentication
    private router: Router, // Inject Router for navigation
    private dialogRef: MatDialogRef<ImageDialogComponent>, // Inject MatDialogRef to close the dialog
    private sellPropService: SellPropService // Inject SellPropService for deletion
  ) {
    this.currentIndex = data.initialIndex || 0; // Set the initial index based on passed data
  }

  ngOnInit() {
    // Listen for fullscreen change events
    document.addEventListener('fullscreenchange', this.onFullscreenChange.bind(this));
    document.addEventListener('webkitfullscreenchange', this.onFullscreenChange.bind(this));
    document.addEventListener('mozfullscreenchange', this.onFullscreenChange.bind(this));
    document.addEventListener('MSFullscreenChange', this.onFullscreenChange.bind(this));

    // Subscribe to auth status to check if the agent is logged in
    this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.agentIsAuthenticated = isAuthenticated;
      this.loggedInAgentId = this.authService.getAgentId(); // Fetch the logged-in agent's ID from AuthService
    });
  }

  ngOnDestroy() {
    // Clean up event listeners
    document.removeEventListener('fullscreenchange', this.onFullscreenChange.bind(this));
    document.removeEventListener('webkitfullscreenchange', this.onFullscreenChange.bind(this));
    document.removeEventListener('mozfullscreenchange', this.onFullscreenChange.bind(this));
    document.removeEventListener('MSFullscreenChange', this.onFullscreenChange.bind(this));
  }

  // Handle fullscreen change events
  onFullscreenChange() {
    const doc = document as any; // Type assertion to avoid TypeScript errors
    const isFullScreenNow = !!doc.fullscreenElement || !!doc.webkitFullscreenElement || !!doc.mozFullScreenElement || !!doc.msFullscreenElement;
    this.isFullscreen = isFullScreenNow;
  }

  // Host listener to listen to keydown events
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.previousImage(); // Navigate to the previous image on ArrowLeft key press
    } else if (event.key === 'ArrowRight') {
      this.nextImage(); // Navigate to the next image on ArrowRight key press
    } else if (event.key === 'f' || event.key === 'F') {
      this.toggleFullscreen(); // Toggle fullscreen on 'f' key press
    } else if (event.key === 'Escape' && this.isFullscreen) {
      this.closeFullscreen(); // Exit fullscreen on 'Escape' key press
    }
  }

  // Navigate to the previous image, looping back if at the first image
  previousImage() {
    if (this.currentIndex === 0) {
      this.currentIndex = this.data.images.length - 1; // Go to the last image
    } else {
      this.currentIndex--;
    }
  }

  // Navigate to the next image, looping back if at the last image
  nextImage() {
    if (this.currentIndex === this.data.images.length - 1) {
      this.currentIndex = 0; // Go to the first image
    } else {
      this.currentIndex++;
    }
  }

  // Toggle fullscreen mode
  toggleFullscreen() {
    if (!this.isFullscreen) {
      this.openFullscreen();
    } else {
      this.closeFullscreen();
    }
  }

  // Open fullscreen mode
  openFullscreen() {
    const elem: any = this.dialogContainer.nativeElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, and Opera
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
      elem.msRequestFullscreen();
    }
    this.isFullscreen = true;
    this.renderer.addClass(this.dialogContainer.nativeElement, 'fullscreen'); // Add fullscreen class to the dialog container
  }

  // Close fullscreen mode
  closeFullscreen() {
    const doc: any = document;
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.mozCancelFullScreen) { // Firefox
      doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) { // Chrome, Safari, and Opera
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) { // IE/Edge
      doc.msExitFullscreen();
    }
    this.isFullscreen = false;
    this.renderer.removeClass(this.dialogContainer.nativeElement, 'fullscreen'); // Remove fullscreen class from the dialog container
  }

  // Handle the Edit button click
  onEdit() {
    this.dialogRef.close(); // Close the dialog
    this.router.navigate(['/sell-prop-edit', this.data.propId]); // Navigate to the edit page with the property ID
  }

  // Handle the Delete button click
  onDelete() {
    if (confirm('Are you sure you want to delete this property?')) {
      this.sellPropService.deleteSellProp(this.data.propId).subscribe(() => {
        this.dialogRef.close(); // Close the dialog on successful deletion
        alert('Property deleted successfully!');
      });
    }
  }
}
