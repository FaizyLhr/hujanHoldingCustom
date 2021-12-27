import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  allUsers: any;
  role: number = 1;
  status: number = 1;
  user: any;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.getNews();
  }

  getNews() {
    this.userService.getAllUsers().subscribe(
      (data) => {
        console.log(data);
        this.allUsers = data.data.result;
        // console.log(this.customerUsers);
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

  delUser(slug: string): void {
    this.userService.delUser(slug).subscribe(
      (result) => {
        this.user = result.data;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'User Deleted',
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
