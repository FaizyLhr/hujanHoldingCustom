import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  editPostForm: any;

  slug: any;

  constructor(
    private formBuilder: FormBuilder,
    private newsService: NewsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.editPostForm = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
    });

    this.route.params.subscribe((params) => {
      // console.log(params['email']);
      this.slug = params['slug'];
      // console.log(this.email);
    });

    this.getPost();
  }

  getPost() {
    this.newsService.getNewsDetail(this.slug).subscribe((result) => {
      console.log('result', result);
      this.editPostForm.patchValue(result.data);
      // console.log(this.user);
    });
  }

  onSubmit() {
    this.newsService.update(this.editPostForm.value, this.slug).subscribe(
      (result) => {
        console.log(result);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500,
        });
        this.editPostForm.reset();
        this.router.navigate(['/home/community']);
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
