import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SellPropService } from '../sell-prop.service';

@Component({
  selector: 'app-sell-prop-form',
  templateUrl: './sell-prop-form.component.html',
  styleUrls: ['./sell-prop-form.component.css']
})
export class SellPropFormComponent {
  tipovi = [
    { value: '1', name: 'Stan' },
    { value: '2', name: 'Kuca' },
    { value: '3', name: 'Poslovni prostor' }
  ]

  strukture = [
    { value: '1', name: 'Garonjera' },
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
  imgPreview!: string

  private mode = 'create'
  private propId!: any
  
  constructor (public selPropService: SellPropService) {}


  ngOnInit(): void {
    this.form = new FormGroup({
      'tip': new FormControl(null, {
        validators: [Validators.required]
      }),
      'povrsina': new FormControl(null, {validators: [Validators.required]}),
      'cenaKvadrata': new FormControl(null, {validators: [Validators.required]}),
      'struktura': new FormControl(null, {validators: [Validators.required]}),
      'sprat': new FormControl(null, {validators: [Validators.required]}),
      'brojSpavacihSoba': new FormControl(null, {validators: [Validators.required]}),
      'opis': new FormControl(null, {validators: [Validators.required]})
    })
  }


  onSaveProp() {
    this.selPropService.addSellProp(
      this.form.value.tip,
      this.form.value.povrsina,
      this.form.value.cenaKvadrata,
      this.form.value.struktura,
      this.form.value.sprat,
      this.form.value.brojSpavacihSoba,
      this.form.value.opis)
  }
}
