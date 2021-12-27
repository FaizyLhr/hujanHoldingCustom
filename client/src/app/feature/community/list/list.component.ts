import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  allNews: any;
  role: number = 1;
  status: number = 1;
  user: any;

  constructor(private router: Router, private newsService: NewsService) {}

  ngOnInit(): void {
    this.getNews();
  }

  getNews() {
    this.newsService.getNews(1).subscribe(
      (data) => {
        console.log(data);
        this.allNews = data.data.result;
        // console.log(this.customerUsers);
      },
      (err) => {
        Swal.fire({
          title: 'Error!',
          text: 'Users Not Found',
          icon: 'error',
          confirmButtonText: 'Go Back',
        });
      }
    );
  }

  delPost(slug: string): void {
    this.newsService.delPost(slug).subscribe(
      (result) => {
        this.user = result.data;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Post Deleted',
          showConfirmButton: false,
          timer: 1500,
        });
        if (result.status === 200) {
          this.getNews();
        }
      },
      (err) => {
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Go Back',
        });
      }
    );
  }
}
