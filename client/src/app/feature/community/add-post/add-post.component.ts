import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewsService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
})
export class AddPostComponent implements OnInit {
  addPostForm!: FormGroup;
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
    this.addPostForm = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  onSubmit(): void {
    console.log(this.addPostForm);
    // console.log('Method', this.user);
    this.newsService.postNews(this.addPostForm.value).subscribe(
      (data) => {
        console.log(data);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'News Seeded',
          showConfirmButton: false,
          timer: 1500,
        });
        this.addPostForm.reset();
        this.router.navigate(['/home/community']);
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: err.message,
          text: err.message,
          footer: '<a href="">Why do I have this issue?</a>',
        });
      }
    );
  }
}
