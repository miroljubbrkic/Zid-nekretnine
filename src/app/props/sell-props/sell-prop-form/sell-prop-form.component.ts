import { validateImage } from "image-validator";

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SellPropService } from '../sell-prop.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SellProp } from '../sell-prop.model';
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Location } from "@angular/common";

@Component({
  selector: 'app-sell-prop-form',
  templateUrl: './sell-prop-form.component.html',
  styleUrls: ['./sell-prop-form.component.css']
})
export class SellPropFormComponent implements OnInit, OnDestroy {
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

  tip = ''
  povrsina = ''
  cenaKvadrata = ''
  struktura = ''
  sprat = ''
  brojSpavacihSoba = ''
  opis = ''
  isLoading = false

  form!: FormGroup
  imgPreviews: string[] = []
  oldImgs: string[] =[]
  newImgs: string[] =[]

  private mode = 'create'
  private propId!: any
  private sellProp!: SellProp
  private authStatusSub!: Subscription
  
  constructor (
    public sellPropService: SellPropService, 
    public route: ActivatedRoute, 
    private authService: AuthService,
    private location: Location
  ) {}
  


  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false
    })

    this.form = new FormGroup({
      'tip': new FormControl(null, {validators: [Validators.required]}),
      'povrsina': new FormControl(null, {validators: [Validators.required]}),
      'cenaKvadrata': new FormControl(null, {validators: [Validators.required]}),
      'struktura': new FormControl(null, {validators: [Validators.required]}),
      'sprat': new FormControl(null, {validators: [Validators.required]}),
      'brojSpavacihSoba': new FormControl(null, {validators: [Validators.required]}),
      'slike': new FormControl(null),
      'opis': new FormControl(null, {validators: [Validators.required]})
    })

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('propId')) {
        this.mode = 'edit'
        this.propId = paramMap.get('propId')
        this.isLoading = true
        this.sellPropService.getSellProp(this.propId).subscribe(propData => {
          this.isLoading = false
          this.sellProp = {
            _id: propData.sellProp._id,
            tip: propData.sellProp.tip,
            povrsina: propData.sellProp.povrsina,
            cenaKvadrata: propData.sellProp.cenaKvadrata,
            struktura: propData.sellProp.struktura,
            sprat: propData.sellProp.sprat,
            brojSpavacihSoba: propData.sellProp.brojSpavacihSoba,
            slike: propData.sellProp.slike,
            opis: propData.sellProp.opis,
            agent: propData.sellProp.agent
          }
          this.form.setValue({
            'tip': this.sellProp.tip,
            'povrsina': this.sellProp.povrsina,
            'cenaKvadrata': this.sellProp.cenaKvadrata,
            'struktura': this.sellProp.struktura,
            'sprat': this.sellProp.sprat,
            'brojSpavacihSoba': this.sellProp.brojSpavacihSoba,
            'slike': null,
            'opis': this.sellProp.opis
          })

          if (this.sellProp.slike && this.sellProp.slike.length > 0) {
            this.oldImgs = [...this.sellProp.slike]
            this.imgPreviews = [...this.sellProp.slike]
          }
        })
    } else {
        this.mode = 'create'
        this.propId = null
      }
    })


    
  }


  // Function to validate multiple images
  async validateMultipleImages(files: FileList): Promise<boolean> {
    for (const file of Array.from(files)) {
      const isValidImage = await validateImage(file);
      if (!isValidImage) {
        return false; // Return false if any image is invalid
      }
    }
    return true; // Return true if all images are valid
  }

  // Updated function to handle file input changes
  async onImagePicked(event: Event): Promise<void> {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) {
      return; // If no files are selected, do nothing
    }

    // Validate all selected images
    const areAllImagesValid = await this.validateMultipleImages(files);

    if (areAllImagesValid) {
      const currentImages = this.form.get('slike')?.value || [];
      const newImages = Array.from(files);

        // Append new valid images to existing images
      this.form.patchValue({ 'slike': [...currentImages, ...newImages] });
      this.form.get('slike')?.updateValueAndValidity();
      console.log('All images are valid and form is updated.');


      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imgPreviews.push(reader.result as string); // Add image preview to the array
        };
        reader.readAsDataURL(file); // Read the file as a Data URL
      });

    } else {
      console.log('One or more images are invalid. Form not updated.');
    }
  }

  onDeleteImage(index: number): void {
    // Check if the index corresponds to an old image
    if (index < this.oldImgs.length) {
      // Remove the image from old images and imgPreviews
      this.oldImgs.splice(index, 1);
      this.imgPreviews.splice(index, 1);
      console.log('Old image deleted from both oldImgs and imgPreviews.');
    } else {
      // The index corresponds to a new image stored in the form data
      const newImageIndex = index - this.oldImgs.length; // Adjust index for new images
  
      // Remove the image preview of new images
      this.imgPreviews.splice(index, 1);
  
      // Remove the corresponding file from the form control value
      const currentFiles = this.form.get('slike')?.value || [];
      currentFiles.splice(newImageIndex, 1); // Remove the file at newImageIndex
      this.form.patchValue({ 'slike': currentFiles });
      console.log('New image deleted from form data.');
    }
  
    // Update form control validity
    this.form.get('slike')?.updateValueAndValidity();
    console.log('Image deleted and form updated.');
  }
  


  onSaveProp() {
    if (this.form.invalid) {
      return
    }
    this.isLoading = true

    const formData = new FormData();
    formData.append('tip', this.form.value.tip);
    formData.append('povrsina', this.form.value.povrsina.toString());
    formData.append('cenaKvadrata', this.form.value.cenaKvadrata.toString());
    formData.append('struktura', this.form.value.struktura);
    formData.append('sprat', this.form.value.sprat.toString());
    formData.append('brojSpavacihSoba', this.form.value.brojSpavacihSoba.toString());
    formData.append('opis', this.form.value.opis);

    // Append old images (URLs) to FormData
    this.oldImgs.forEach((imageUrl) => {
      formData.append('existingImages', imageUrl);
    });

    // Append new image files to FormData (if any)
    if (this.form.value.slike) {
      this.form.value.slike.forEach((file: File) => {
        formData.append('slike', file);
      });
    }

    if (this.mode === 'create') {
      this.sellPropService.addSellProp(
        this.form.value.tip,
        this.form.value.povrsina,
        this.form.value.cenaKvadrata,
        this.form.value.struktura,
        this.form.value.sprat,
        this.form.value.brojSpavacihSoba,
        this.form.value.slike,
        this.form.value.opis
      )
    } else {
      this.sellPropService.updateSellProp(
        this.propId, 
        this.form.value.tip,
        this.form.value.povrsina,
        this.form.value.cenaKvadrata,
        this.form.value.struktura,
        this.form.value.sprat,
        this.form.value.brojSpavacihSoba,
        {
          oldImages: this.oldImgs,
          newImages: this.form.value.slike? this.form.value.slike : []
        }, // Combined object with old and new images
        this.form.value.opis)
    }

    this.form.reset()
    
  }

  onCancel(): void {
    this.location.back(); // Navigate back to the previous page
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe()
  }
}