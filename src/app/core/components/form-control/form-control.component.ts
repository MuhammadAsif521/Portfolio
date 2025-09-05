
import { Component, inject, InputSignal, input, ModelSignal, model, output, OutputEmitterRef, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgStyle, TitleCasePipe } from '@angular/common';
import { InputTypes } from 'src/app/Pages/Types/type';
import { Subject } from 'rxjs';

@Component({

  selector: 'form-control',

  templateUrl: './form-control.component.html',

  styleUrls: ['./form-control.component.scss'],

  standalone: true,

  imports: [ReactiveFormsModule, NgStyle, TitleCasePipe],

  viewProviders: [

    {

      provide: ControlContainer,

      useFactory: () => inject(ControlContainer, { skipSelf: true })

    }

  ],

  changeDetection: ChangeDetectionStrategy.OnPush

})

export class FormControlComponent implements OnInit, OnDestroy {
  // Inputs
  public name: InputSignal<string> = input.required<string>({ alias: 'controlName' });
  public type: ModelSignal<InputTypes> = model<InputTypes>('text');
  public multiple: InputSignal<boolean> = input<boolean>(false);
  public placeholder: InputSignal<string> = input<string>('');
  public isTextArea: InputSignal<boolean> = input<boolean>(false, { alias: 'textarea' });
  public required: InputSignal<boolean> = input<boolean>(true);
  public disable: InputSignal<boolean> = input<boolean>(false);
  public textAreaHeight: InputSignal<string> = input<string>('100px');
  public defaultValue: InputSignal<any> = input<any>('');
  private destroy$ = new Subject<void>();
  // Outputs
  public focus: OutputEmitterRef<void> = output<void>();
  public blur: OutputEmitterRef<void> = output<void>();
  // Dependencies
  private parentContainer: ControlContainer = inject(ControlContainer);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  public control!: FormControl;
  public selectedFiles: { file: File | null; preview: string; name: string }[] = [];
  ngOnInit(): void {
  const controlName = this.name();
  let formControl = this.parentFormGroup.get(controlName);
  
  if (formControl instanceof FormControl) {
    this.control = formControl;
  } else {
    const validationList: ((control: AbstractControl) => ValidationErrors | null)[] = [];
    if (this.required()) {
      validationList.push(Validators.required);
    }
    if (this.type() === 'email') {
      validationList.push(Validators.email);
      validationList.push(
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      );
    }
    this.control = new FormControl(this.defaultValue(), validationList);
    this.parentFormGroup.addControl(controlName, this.control);
  }

  if (this.disable() || this.control.disabled) {
    this.control.disable();
  } else {
    this.control.enable();
  }

  if (this.defaultValue()) {
    this.control.setValue(this.defaultValue());
  }

  // FOR FILE INPUTS: Subscribe to control value changes to handle existing images
  if (this.type() === 'file') {
    this.control.valueChanges.subscribe(value => {
      if (value && Array.isArray(value) && typeof value[0] === 'string') {
        // Handle existing image URLs from database
        this.setFilesFromUrls(value);
      }
    });
  }
}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  public get parentFormGroup(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }
  public get fc(): AbstractControl<any, any> {
    return this.control;
  }
  public onFocus(): void {
    this.focus.emit();
  }
  public onBlur(): void {
    this.blur.emit();
  }
  public shouldShowErrorMessage(): boolean {
    return this.fc?.invalid && this.fc?.touched;
  }
  public getErrorMessage(): string {
    if (!this.fc) return '';
    if (this.fc.errors?.['required']) {
      const titleCasePipe = new TitleCasePipe();
      return `${titleCasePipe.transform(this.name())} is required.`;
    }
    if (this.fc.errors?.['email']) {
      return 'Please enter a valid email address.';
    }
    if (this.fc.errors?.['minlength']) {
      return `Minimum length is ${this.fc.errors['minlength'].requiredLength}.`;
    }
    if (this.fc.errors?.['pattern']) {
      return `Invalid format.`;
    }
    return '';
  }
  // ---------------- FILE INPUT HANDLING ----------------
  public onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const files = this.multiple() ? Array.from(input.files) : [input.files[0]];
    // Filter out duplicates
    const newFiles = files.filter(
      file => !this.selectedFiles.some(f => f.name === file.name && f.file?.size === file.size)
    );
    newFiles.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFiles.push({
          file,
          preview: reader.result as string,
          name: file.name
        });
        this.cdr.markForCheck();
        const allFiles = this.selectedFiles.map(f => f.file).filter(Boolean);
        this.control.setValue(this.multiple() ? allFiles : allFiles[0]);
      };
      reader.readAsDataURL(file);
    });
  }
  public removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    if (this.multiple()) {
      this.control.setValue(this.selectedFiles.map(f => f.file).filter(Boolean));
    } else {
      this.control.setValue(null);
    }
    this.cdr.markForCheck();
  }

  public setFilesFromUrls(urls: string[]): void {
  if (!urls || urls.length === 0) {
    this.selectedFiles = [];
    this.cdr.markForCheck();
    return;
  }

  this.selectedFiles = urls.map((url, index) => ({
    file: null, // No actual file for existing URLs
    preview: url,
    name: `existing-image-${index}`
  }));
  
  // Don't override the control value here - let it keep the URLs
  this.cdr.markForCheck();
}
}