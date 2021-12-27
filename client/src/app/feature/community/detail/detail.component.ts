import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from 'src/app/core/services';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  news: any;
  slug: any;

  constructor(
    private newsService: NewsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // console.log('PARAMS:SS', this.route.params);

    this.route.params.subscribe((params) => {
      // console.log(params['email']);
      this.slug = params['slug'];
      // console.log(this.email);
    });
    this.getNews();
  }

  getNews() {
    this.newsService.getNewsDetail(this.slug).subscribe((result) => {
      console.log('result', result);
      this.news = result.data;
      // console.log(this.allUsers);
    });
  }
}
