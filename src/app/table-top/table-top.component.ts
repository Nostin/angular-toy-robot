import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RobotFaceDirectionEnum } from '../../globalTypes';
import type { TableStateType } from '../../globalTypes';

@Component({
  selector: 'app-table-top',
  templateUrl: './table-top.component.html',
  styleUrls: ['./table-top.component.css'],
})
export class TableTopComponent implements OnInit {
  RobotFaceOptions = RobotFaceDirectionEnum;
  tableTop$: Observable<TableStateType>;

  constructor(private store: Store<{ tableTop: TableStateType }>) {
    this.tableTop$ = store.pipe(select('tableTop'));
  }

  gridSizeArray(): number[] {
    let gridSize = 0;
    this.tableTop$.forEach((state) => {
      if (state.gridSize) {
        gridSize = state.gridSize;
      }
    });
    return Array(gridSize);
  }

  ngOnInit(): void {}
}
