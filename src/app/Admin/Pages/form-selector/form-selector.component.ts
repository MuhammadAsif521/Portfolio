// form-selector.component.ts - FIXED VERSION
import { TitleCasePipe } from '@angular/common';
import { Component, inject, InputSignal, input, output, OutputEmitterRef, OnInit, HostListener, signal, WritableSignal, AfterViewInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'form-selector',
  templateUrl: './form-selector.component.html',
  styleUrls: ['./form-selector.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, TitleCasePipe],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ]
})
export class FormSelectorComponent implements OnInit, AfterViewInit {
  // Inputs
  public name: InputSignal<string> = input.required<string>({ alias: 'controlName' });
  public placeholder: InputSignal<string | undefined> = input<string>();
  public label: InputSignal<string> = input<string>('');
  public required: InputSignal<boolean> = input<boolean>(true);
  public options: InputSignal<any[]> = input.required<any[]>();
  public defaultValue: InputSignal<any> = input<any>(null);
  public disable: InputSignal<boolean> = input<boolean>(false);
  public multiple: InputSignal<boolean> = input<boolean>(false);
  
  // Outputs
  public onChange: OutputEmitterRef<any> = output<any>();
  
  // State
  public isDropdownOpen: WritableSignal<boolean> = signal<boolean>(false);
  public selectedItems: string[] = [];
  private parentContainer: ControlContainer = inject(ControlContainer);
  public control!: FormControl<any>;

  ngOnInit(): void {
    const controlName = this.name();
    let formControl = this.parentFormGroup.get(controlName);
    
    if (formControl instanceof FormControl) {
      this.control = formControl as FormControl<any>;
    } else {
      const validationList: ((control: AbstractControl) => ValidationErrors | null)[] = [];
      if (this.required()) {
        validationList.push(Validators.required);
      }
      
      this.control = new FormControl<any>(
        this.multiple() ? [] : '',
        { nonNullable: true, validators: validationList }
      );
      this.parentFormGroup.addControl(controlName, this.control);
    }

    // Set default value if provided
    if (this.defaultValue() !== null) {
      this.setControlValue(this.defaultValue());
    }

    // Subscribe to form control value changes to sync selectedItems
    this.control.valueChanges.subscribe(value => {
      this.syncSelectedItems(value);
    });

    // Handle initial control state
    if (this.disable() || this.control.disabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  ngAfterViewInit(): void {
    // Sync selectedItems with current control value after view init
    // This handles cases where the form is patched after component initialization
    setTimeout(() => {
      this.syncSelectedItems(this.control.value);
    });
  }

  private setControlValue(value: any): void {
    if (this.multiple()) {
      const arrayValue = Array.isArray(value) ? value : [];
      this.selectedItems = [...arrayValue];
      this.control.setValue(arrayValue);
    } else {
      const singleValue = value || '';
      this.selectedItems = singleValue ? [singleValue] : [];
      this.control.setValue(singleValue);
    }
  }

  private syncSelectedItems(value: any): void {
    if (this.multiple()) {
      this.selectedItems = Array.isArray(value) ? [...value] : [];
    } else {
      this.selectedItems = value ? [value] : [];
    }
  }

  public toggleDropDown(): void {
    if (this.disable() || this.control.disabled) return;
    this.isDropdownOpen.set(!this.isDropdownOpen());
    if (!this.isDropdownOpen()) {
      this.control.markAsTouched();
    }
  }

  public onSelectItem(item: string): void {
    if (this.multiple()) {
      const index = this.selectedItems.indexOf(item);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(item);
      }
      const newValue = [...this.selectedItems];
      this.control.setValue(newValue);
      this.onChange.emit(newValue);
    } else {
      this.selectedItems = [item];
      this.control.setValue(item);
      this.onChange.emit(item);
      this.isDropdownOpen.set(false);
    }
  }

  public isSelected(item: string): boolean {
    return this.selectedItems.includes(item);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('form-selector');
    if (!clickedInside && this.isDropdownOpen()) {
      this.isDropdownOpen.set(false);
      if (!this.fc.touched) this.fc.markAsTouched();
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') this.isDropdownOpen.set(false);
  }

  private get parentFormGroup(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }

  public get fc(): AbstractControl<any> {
    return this.control;
  }

  public shouldShowErrorMessage(): boolean {
    return this.fc?.invalid && this.fc?.touched;
  }

  public getErrorMessage(): string {
    if (!this.fc) return '';
    if (this.fc.errors?.['required']) return `${this.name()} is required.`;
    return '';
  }
}