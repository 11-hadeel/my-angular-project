import { Component } from '@angular/core';
// ...existing code...
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
// ...existing code...
@Component({
  selector: 'app-application-form',
  standalone: false,
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.css'
})
export class ApplicationFormComponent {
  applicationForm: FormGroup;
  submitted = false;
  submitSuccess = false;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.applicationForm = this.fb.group({
      // Personal Information
      fullName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^[\d\s\+\-\(\)]+$/)
      ]],
      nationality: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      dateOfBirth: ['', [
        Validators.required,
        this.ageValidator
      ]],
      gender: ['', Validators.required],
      residence: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      
      // Education & Background
      educationLevel: ['', Validators.required],
      fieldOfStudy: ['', Validators.minLength(2)],
      currentStatus: ['', Validators.required],
      currentOccupation: [''],
      
      // Technical Experience
      hasWebExperience: ['', Validators.required],
      webExperienceDescription: [''],
      
      // Language Skills
      englishLevel: ['', Validators.required],
      
      // Motivation & Goals
      motivation: ['', [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(500)
      ]],
      careerGoals: ['', [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(500)
      ]],
      
      // Other Details
      linkedinUrl: ['', [
        Validators.pattern(/^https:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-\.]+\/?$/)
      ]],
      portfolioUrl: ['', [
        Validators.pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&=]*)$/)
      ]],
      hearAbout: ['', Validators.required],
      
      // Consent & Commitment
      confirmTruth: [false, Validators.requiredTrue],
      agreeTerms: [false, Validators.requiredTrue],
      commitProgram: [false, Validators.requiredTrue]
    });
    
    this.setupConditionalValidators();
  }

  setupConditionalValidators() {
    // Add validation for current occupation when status is 'yes'
    this.applicationForm.get('currentStatus')?.valueChanges.subscribe(value => {
      const currentOccupationControl = this.applicationForm.get('currentOccupation');
      if (value === 'yes') {
        currentOccupationControl?.setValidators([
          Validators.required,
          Validators.minLength(2)
        ]);
      } else {
        currentOccupationControl?.clearValidators();
        currentOccupationControl?.setValue('');
      }
      currentOccupationControl?.updateValueAndValidity();
    });
    
    // Add validation for web experience description when experience is 'yes'
    this.applicationForm.get('hasWebExperience')?.valueChanges.subscribe(value => {
      const webExperienceControl = this.applicationForm.get('webExperienceDescription');
      if (value === 'yes') {
        webExperienceControl?.setValidators([
          Validators.required,
          Validators.minLength(10)
        ]);
      } else {
        webExperienceControl?.clearValidators();
        webExperienceControl?.setValue('');
      }
      webExperienceControl?.updateValueAndValidity();
    });
  }

  ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      const actualAge = age - 1;
      return actualAge < 16 ? { ageValidator: true } : null;
    }
    
    return age < 16 ? { ageValidator: true } : null;
  }

  onSubmit() {
    this.submitted = true;
    
    if (this.applicationForm.invalid) {
      this.markFormGroupTouched(this.applicationForm);
      this.scrollToFirstInvalidControl();
      return;
    }

    this.isLoading = true;
    
    // Here you would typically call your API service
    // For demonstration, we'll simulate an API call with setTimeout
    setTimeout(() => {
      console.log('Form submitted successfully:', this.applicationForm.value);
      this.submitSuccess = true;
      this.isLoading = false;
      
      // Reset form after 5 seconds (optional)
      setTimeout(() => {
        this.applicationForm.reset();
        this.submitted = false;
        this.submitSuccess = false;
      }, 5000);
    }, 1500);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private scrollToFirstInvalidControl() {
    const firstInvalidControl = document.querySelector('.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }

  get f() { return this.applicationForm.controls; }
  getInvalidControls(): string[] {
    const invalid = [];
    const controls = this.applicationForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  getControlErrors(controlName: string): string {
    const control = this.applicationForm.get(controlName);
    if (control && control.errors) {
      return JSON.stringify(control.errors);
    }
    return '';
  }
}