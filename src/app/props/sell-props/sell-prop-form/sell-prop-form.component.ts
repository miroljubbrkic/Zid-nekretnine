import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SellPropService } from '../sell-prop.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SellProp } from '../sell-prop.model';
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Location } from '@angular/common';
import { validateImage } from 'image-validator';

@Component({
  selector: 'app-sell-prop-form',
  templateUrl: './sell-prop-form.component.html',
  styleUrls: ['./sell-prop-form.component.css']
})
export class SellPropFormComponent implements OnInit, OnDestroy {
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

  grejanje = [
    { value: 'centralno', name: 'Centralno' },
    { value: 'etazno', name: 'Etažno' },
    { value: 'podno', name: 'Podno' },
    { value: 'ta_pec', name: 'TA peć' },
    { value: 'struja', name: 'Struja' }
  ];

  form!: FormGroup;
  imgPreviews: string[] = [];
  oldImgs: string[] = [];
  newImgs: File[] = [];
  private mode = 'create';
  private propId!: string | null;
  private sellProp!: SellProp;
  isLoading = false;
  private authStatusSub!: Subscription;

  constructor(
    public sellPropService: SellPropService, 
    public route: ActivatedRoute, 
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(() => {
      this.isLoading = false;
    });

    this.form = new FormGroup({
      'naslov': new FormControl(null, { validators: [Validators.required] }),
      'tip': new FormControl(null, { validators: [Validators.required] }),
      'struktura': new FormControl(null, { validators: [Validators.required] }),
      'grad': new FormControl(null, { validators: [Validators.required] }),
      'naselje': new FormControl(null, { validators: [Validators.required] }),
      'adresa': new FormControl(null, { validators: [Validators.required] }),
      'povrsina': new FormControl(null, { validators: [Validators.required] }),
      'cena': new FormControl(null, { validators: [Validators.required] }),
      'spratovi': new FormControl(null, { validators: [Validators.required] }),
      'sprat': new FormControl(null, { validators: [Validators.required] }),
      'lift': new FormControl(null, { validators: [Validators.required] }),
      'grejanje': new FormControl(null, { validators: [Validators.required] }),
      'namestenost': new FormControl(null, { validators: [Validators.required] }),
      'uknjizenost': new FormControl(null, { validators: [Validators.required] }),
      'slike': new FormControl(null),
      'opis': new FormControl(null, { validators: [Validators.required] })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('propId')) {
        this.mode = 'edit';
        this.propId = paramMap.get('propId');
        this.isLoading = true;
        this.sellPropService.getSellProp(this.propId!).subscribe(propData => {
          this.isLoading = false;
          this.sellProp = propData.sellProp;
          this.form.setValue({
            'naslov': this.sellProp.naslov,
            'tip': this.sellProp.tip,
            'struktura': this.sellProp.struktura,
            'grad': this.sellProp.grad,
            'naselje': this.sellProp.naselje,
            'adresa': this.sellProp.adresa,
            'povrsina': this.sellProp.povrsina,
            'cena': this.sellProp.cena,
            'spratovi': this.sellProp.spratovi,
            'sprat': this.sellProp.sprat,
            'lift': this.sellProp.lift,
            'grejanje': this.sellProp.grejanje,
            'namestenost': this.sellProp.namestenost,
            'uknjizenost': this.sellProp.uknjizenost,
            'slike': null,
            'opis': this.sellProp.opis
          });

          if (this.sellProp.slike && this.sellProp.slike.length > 0) {
            this.oldImgs = [...this.sellProp.slike];
            this.imgPreviews = [...this.sellProp.slike];
          }
        });
      } else {
        this.mode = 'create';
        this.propId = null;
      }
    });
  }

  // async onImagePicked(event: Event): Promise<void> {
  //   const files = (event.target as HTMLInputElement).files;
  //   if (!files || files.length === 0) return;

  //   const currentImages = this.form.get('slike')?.value || [];
  //   const newImages = Array.from(files);

  //   this.form.patchValue({ 'slike': [...currentImages, ...newImages] });
  //   this.form.get('slike')?.updateValueAndValidity();

  //   Array.from(files).forEach((file) => {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.imgPreviews.push(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // }

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
    if (index < this.oldImgs.length) {
      this.oldImgs.splice(index, 1);
      this.imgPreviews.splice(index, 1);
    } else {
      const newImageIndex = index - this.oldImgs.length;
      this.imgPreviews.splice(index, 1);
      const currentFiles = this.form.get('slike')?.value || [];
      currentFiles.splice(newImageIndex, 1);
      this.form.patchValue({ 'slike': currentFiles });
    }
    this.form.get('slike')?.updateValueAndValidity();
  }

  onSaveProp(): void {
    if (this.form.invalid) return;

    this.isLoading = true;

    const formData = new FormData();
    formData.append('naslov', this.form.value.naslov);
    formData.append('tip', this.form.value.tip);
    formData.append('struktura', this.form.value.struktura);
    formData.append('grad', this.form.value.grad);
    formData.append('naselje', this.form.value.naselje);
    formData.append('adresa', this.form.value.adresa);
    formData.append('povrsina', this.form.value.povrsina.toString());
    formData.append('cena', this.form.value.cena.toString());
    formData.append('spratovi', this.form.value.spratovi.toString());
    formData.append('sprat', this.form.value.sprat.toString());
    formData.append('lift', this.form.value.lift);
    formData.append('grejanje', this.form.value.grejanje.toString());
    formData.append('namestenost', this.form.value.namestenost);
    formData.append('uknjizenost', this.form.value.uknjizenost);
    formData.append('opis', this.form.value.opis);

    this.oldImgs.forEach((imageUrl) => {
      formData.append('existingImages', imageUrl);
    });

    if (this.form.value.slike) {
      this.form.value.slike.forEach((file: File) => {
        formData.append('slike', file);
      });
    }

    if (this.mode === 'create') {
      this.sellPropService.addSellProp(
        this.form.value.naslov,
        this.form.value.tip,
        this.form.value.struktura,
        this.form.value.grad,
        this.form.value.naselje,
        this.form.value.adresa,
        this.form.value.povrsina,
        this.form.value.cena,
        this.form.value.spratovi,
        this.form.value.sprat,
        this.form.value.lift,
        this.form.value.grejanje,
        this.form.value.namestenost,
        this.form.value.uknjizenost,
        this.form.value.slike,
        this.form.value.opis
      );
    } else {
      this.sellPropService.updateSellProp(
        this.propId!,
        this.form.value.naslov,
        this.form.value.tip,
        this.form.value.struktura,
        this.form.value.grad,
        this.form.value.naselje,
        this.form.value.adresa,
        this.form.value.povrsina,
        this.form.value.cena,
        this.form.value.spratovi,
        this.form.value.sprat,
        this.form.value.lift,
        this.form.value.grejanje,
        this.form.value.namestenost,
        this.form.value.uknjizenost,
        {
          oldImages: this.oldImgs,
          newImages: this.form.value.slike ? this.form.value.slike : []
        },
        this.form.value.opis
      );
    }

    this.form.reset();
    this.isLoading = false;
  }

  onCancel(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
