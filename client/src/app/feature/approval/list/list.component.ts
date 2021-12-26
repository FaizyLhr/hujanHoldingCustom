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
  approvalUsers: any;
  user: any;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getApprovals();
  }

  getApprovals() {
    this.userService.getApprovals(1).subscribe(
      (data) => {
        console.log(data);
        this.approvalUsers = data.data.result;
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
    this.userService.changeStatus(email, 0).subscribe(
      (result) => {
        this.user = result.data;

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'User is Activated',
          showConfirmButton: false,
          timer: 1500,
        });

        if (result.status === 200) {
          this.getApprovals();
        }
        if (result.status === 400) {
          Swal.fire({
            title: 'Error!',
            text: 'User is already in this state',
            icon: 'error',
            confirmButtonText: 'Go Back',
          });
        }
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

  rejectUser(email: string): void {
    this.userService.changeStatus(email, 3).subscribe(
      (result) => {
        this.user = result.data;

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'User is Rejected',
          showConfirmButton: false,
          timer: 1500,
        });

        if (result.status === 200) {
          this.getApprovals();
        }
        if (result.status === 400) {
          Swal.fire({
            title: 'Error!',
            text: 'User is already Active',
            icon: 'error',
            confirmButtonText: 'Go Back',
          });
        }
      },
      (err) => {
        Swal.fire({
          title: 'Error!',
          text: err,
          icon: 'error',
          confirmButtonText: 'Go Back',
        });
      }
    );
  }
}
