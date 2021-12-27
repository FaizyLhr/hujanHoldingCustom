import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hasErrors = false;
  errorMessage!: string;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.userService.attemptAuth('login', this.loginForm.value).subscribe(
      (data) => {
        // console.log(data);
        if (data.data.role == 1 || data.data.role == 2) {
          this.router.navigate(['/home']);
        } else this.router.navigate(['/auth']);
      },
      (err) => {
        this.hasErrors = true;
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Go Back',
        });
        if (err.code === 400) this.errorMessage = 'User is not active by admin';
        else this.errorMessage = 'Invalid credentials';
      }
    );
  }
}
