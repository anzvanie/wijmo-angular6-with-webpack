import { Component, ViewChild, OnInit } from '@angular/core';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import * as wijmo from 'wijmo/wijmo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('grid') grid: WjFlexGrid;

  url = 'http://services.odata.org/Northwind/Northwind.svc/Products';

  // data: any[];

  dataView = new wijmo.CollectionView();

  ngOnInit(): void {
    /** Bruce: Dummy data */
    // const people = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S'.split(',');
    // const minAge = 23, maxAge = 35;
    // this.data = [];

    // for (let i = 0; i < people.length; i++) {
    //   this.data.push({
    //     person: people[i],
    //     age: Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge,
    //     salary: Math.floor(Math.random() * 1000),
    //   });
    // }

    this.loadData();
  }

  loadData(): void {
    const self = this;
    const params = {
      $format: 'json'
    };

    wijmo.httpRequest(
      self.url,
      {
        data: params,
        success: (xhr: XMLHttpRequest) => {
          // Clear columns array
          self.grid.columns.clear();

          const response = JSON.parse(xhr.response);
          const data = response.d ? response.d.results : response.value;
          self.dataView.sourceCollection = data;

          // Auto resize column to fit cell data
          self.grid.autoSizeColumns();
        }
      }
    );
  }

  inputTextChanged(event) {
    this.url = event.target.value;
    this.loadData();
  }

  sortChanged(event) {
    this.dataView.sortDescriptions.clear();
    const sortKey = event.target.value;
    if (sortKey !== 'No sort') {
      const sd = new wijmo.SortDescription(sortKey, true);
      this.dataView.sortDescriptions.push(sd);
      this.grid.autoSizeColumns();
    }
  }

  filterChanged(event) {
  }
}
