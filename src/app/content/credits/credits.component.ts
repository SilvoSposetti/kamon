import {Component, OnInit} from '@angular/core';
import {SearchService} from '../../shared/services/search.service';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.css']
})
export class CreditsComponent implements OnInit {

  public link = 'https://github.com/SilvoSposetti/kamon';

  constructor(private searchService: SearchService) {
  }

  ngOnInit() {
  }

  public goToGitHubPage(): void {
    this.searchService.openLink(this.link);
  }
}
