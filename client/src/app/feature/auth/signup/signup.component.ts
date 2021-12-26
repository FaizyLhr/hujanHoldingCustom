import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  signupForm!: FormGroup;
  hasErrors = false;

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.userService.attemptAuth('signup', this.signupForm.value).subscribe(
      (data) => {
        this.router.navigate(['/auth']);
      },
      (err) => {
        this.hasErrors = true;
      }
    );
  }
}
