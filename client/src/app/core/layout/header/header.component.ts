import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserService } from '../../services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: any;
  fileUrl = environment.file_url;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    console.log(this.user);
    console.log(this.user.img);
  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigate(['/auth']);
  }
}
