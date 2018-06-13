import { Component, ViewChild, OnInit } from '@angular/core';
import * as wjFlexGrid from 'wijmo/wijmo.angular2.grid';
import * as wjcCore from 'wijmo/wijmo';

const DEFAULT_FORMAT = 'json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('grid') grid: wjFlexGrid.WjFlexGrid;

  // Northwind sample data's url
  url = 'http://services.odata.org/Northwind/Northwind.svc/Products';

  dataView = new wjcCore.CollectionView();

  // Sort
  sortFormula = '';
  sortColumn = '';
  sortOrder = 'asc';

  // Filter
  // filterFormula = '';
  // filterColumn = '';
  // filterCondition = '';

  // Group
  groupByFormula = '';
  groupByColumn = '';

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    const self = this;
    const params = {
      $format: DEFAULT_FORMAT
    };

    wjcCore.httpRequest(
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

          // Set sort column default value
          if (self.grid.columns.length) {
            self.sortColumn = self.grid.columns[0].name;
            self.groupByColumn = self.grid.columns[0].name;
            // self.filterColumn = self.grid.columns[0].name;
          }
        }
      }
    );
  }

  dataUrlChange(event) {
    this.url = event.target.value;
    this.loadData();
  }

  sortChange(event?) {
    if (event) {
      this.sortFormula = event.target.value;
    }

    this.dataView.sortDescriptions.clear();

    const conditions = this.sortFormula.split(',');
    for (let i = 0; i < conditions.length; i++) {
      const detailCondition = conditions[i].split('|');
      const isAsc = detailCondition.length === 1 || (detailCondition[1] !== 'desc');
      const sd = new wjcCore.SortDescription(detailCondition[0], isAsc);
      this.dataView.sortDescriptions.push(sd);
    }

    this.grid.autoSizeColumns();
  }

  addSortClick() {

    const newCondition = `${this.sortColumn}|${this.sortOrder}`;

    if (this.sortFormula.includes(this.sortColumn)) {
      const searchRegex = new RegExp(`${this.sortColumn}\\|(asc|desc)`);
      this.sortFormula = this.sortFormula.replace(searchRegex, newCondition);
    } else {
      if (this.sortFormula) {
        this.sortFormula += ',';
      }
      this.sortFormula += newCondition;
    }

    this.sortChange();
  }

  groupByChange(event?) {
    if (event) {
      this.groupByFormula = event.target.value;
    }

    this.dataView.beginUpdate();
    this.dataView.groupDescriptions.clear();

    if (this.groupByFormula) {
      const conditions = this.groupByFormula.split(',');
      for (let i = 0; i < conditions.length; i++) {
        const gd = new wjcCore.PropertyGroupDescription(conditions[i]);
        this.dataView.groupDescriptions.push(gd);
      }
    }

    this.dataView.refresh();
    this.dataView.endUpdate();
  }

  addGroupByClick() {
    if (!this.groupByFormula.includes(this.groupByColumn)) {
      if (this.groupByFormula) {
        this.groupByFormula += ',';
      }

      this.groupByFormula += this.groupByColumn;
    }

    this.groupByChange();
  }

  // filterChange(event) {
  //   if (event) {
  //     this.filterFormula = event.target.value;
  //   }
  // }

  // addFilterClick() {
  //   if (!this.filterCondition) {
  //     return;
  //   }
  //   const newCondition = `${this.filterColumn}|${this.filterCondition}`;
  //   if (!this.filterFormula.includes(newCondition)) {
  //     if (this.filterFormula) {
  //       this.filterFormula += ',';
  //     }
  //     this.filterFormula += newCondition;
  //   }
  // }

}
