import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewsService, UserService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.css'],
})
export class AddNewsComponent implements OnInit {
  addNewsForm!: FormGroup;
  beds: any;
  email: string = '';
  flag: string = 'false';
  user: any;
  num: any;

  constructor(
    private newsService: NewsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addNewsForm = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  onSubmit(): void {
    console.log(this.addNewsForm);
    // console.log('Method', this.user);
    this.newsService.postNews(this.addNewsForm.value).subscribe(
      (data) => {
        console.log(data);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'News Seeded',
          showConfirmButton: false,
          timer: 1500,
        });
        this.addNewsForm.reset();
        this.router.navigate(['/home/sponsor']);
      },
      (err) => {
        console.log(err);

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
          footer: '<a href="">Why do I have this issue?</a>',
        });
        console.error(err);
      }
    );
  }
}
