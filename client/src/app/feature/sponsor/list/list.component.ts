import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService, UserService } from 'src/app/core/services';

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

  constructor(
    private userService: UserService,
    private router: Router,
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.getNews();
  }

  getNews() {
    this.newsService.getNews(2).subscribe(
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

  approveUser(email: string): void {
    // this.userService.changeStatus(email, 0).subscribe(
    //   (result) => {
    //     this.user = result.data;
    //     Swal.fire({
    //       position: 'top-end',
    //       icon: 'success',
    //       title: 'User is Activated',
    //       showConfirmButton: false,
    //       timer: 1500,
    //     });
    //     if (result.status === 200) {
    //       this.getApprovals();
    //     }
    //     if (result.status === 400) {
    //       Swal.fire({
    //         title: 'Error!',
    //         text: 'User is already in this state',
    //         icon: 'error',
    //         confirmButtonText: 'Go Back',
    //       });
    //     }
    //   },
    //   (err) => {
    //     Swal.fire({
    //       title: 'Error!',
    //       text: 'Users Not Found',
    //       icon: 'error',
    //       confirmButtonText: 'Go Back',
    //     });
    //   }
    // );
  }

  rejectUser(email: string): void {
    // this.userService.changeStatus(email, 3).subscribe(
    //   (result) => {
    //     this.user = result.data;
    //     Swal.fire({
    //       position: 'top-end',
    //       icon: 'success',
    //       title: 'User is Rejected',
    //       showConfirmButton: false,
    //       timer: 1500,
    //     });
    //     if (result.status === 200) {
    //       this.getApprovals();
    //     }
    //     if (result.status === 400) {
    //       Swal.fire({
    //         title: 'Error!',
    //         text: 'User is already Active',
    //         icon: 'error',
    //         confirmButtonText: 'Go Back',
    //       });
    //     }
    //   },
    //   (err) => {
    //     Swal.fire({
    //       title: 'Error!',
    //       text: err,
    //       icon: 'error',
    //       confirmButtonText: 'Go Back',
    //     });
    //   }
    // );
  }
}
