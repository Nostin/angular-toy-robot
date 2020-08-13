import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import update from 'immutability-helper';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { addCommandRecord, updateTableTop } from '../store.actions';
import { BaseCommandEnum, RobotFaceDirectionEnum } from '../../globalTypes';
import type { CommandType, TableStateType } from '../../globalTypes';

@Component({
  selector: 'app-command-line',
  templateUrl: './command-line.component.html',
  styleUrls: ['./command-line.component.css'],
})
export class CommandLineComponent {
  tableTop$: Observable<TableStateType>;
  gridSize: number;

  error: string | null = null;

  constructor(private store: Store<{ tableTop: TableStateType }>) {
    this.tableTop$ = store.pipe(select('tableTop'));

    const st = this.getCurrentState();
    if (st) {
      this.gridSize = st.gridSize;
    }
  }

  getCurrentState(): TableStateType | null {
    let currentState: any;
    this.tableTop$.pipe(take(1)).subscribe((state) => (currentState = state));
    return currentState || null;
  }

  handleCommand(cmd: CommandType): void {
    const { baseCommand } = cmd;
    const allowedCommands = Object.values(BaseCommandEnum) as string[];
    const currentTableTopState = this.getCurrentState();

    if (allowedCommands.includes(baseCommand) && currentTableTopState) {
      switch (baseCommand) {
        case BaseCommandEnum.Place:
          this.tryPlaceRobot(cmd, currentTableTopState);
          break;
        case BaseCommandEnum.Move:
          this.tryMoveRobot(cmd, currentTableTopState);
          break;
        case BaseCommandEnum.Left:
        case BaseCommandEnum.Right:
          this.tryTurnRobot(cmd, currentTableTopState);
          break;
        case BaseCommandEnum.Report:
          this.tryReportPosition(cmd, currentTableTopState);
          break;
        default:
          this.error = `Unhandled base command type ${baseCommand}`;
      }
    } else {
      this.error = `Bad command, Please use one of: ${Object.values(BaseCommandEnum).join(', ')}`;
      if (currentTableTopState) {
        const newTableTopState = update(currentTableTopState, {
          reportPosition: { $set: false },
        });
        this.store.dispatch(updateTableTop({ newTableState: newTableTopState }));
      }
    }
  }

  tryPlaceRobot(command: CommandType, currentTableTopState: TableStateType): void {
    const { faceDirection, fullString, xcoord, ycoord } = command;

    let placeError = null;

    if (faceDirection === undefined || xcoord === undefined || ycoord === undefined) {
      placeError = 'Bad Command: expected 4 arguments';
    } else {
      if (!Number.isInteger(xcoord) || !Number.isInteger(ycoord)) {
        placeError = 'Bad Command: X and Y coordinates must be integers';
      }

      if (xcoord < 0 || ycoord < 0 || xcoord >= this.gridSize || ycoord >= this.gridSize) {
        placeError = 'Bad Command: coordinates are off the table';
      }

      const allowedDirections = Object.values(RobotFaceDirectionEnum) as string[];
      if (!faceDirection || !allowedDirections.includes(faceDirection)) {
        placeError = `Bad Command: direction must be one of ${Object.values(allowedDirections).join(', ')}`;
      }
    }

    this.error = placeError;

    const newTableTopState = update(currentTableTopState, {
      faceDirection: {
        $set: !placeError ? (faceDirection as RobotFaceDirectionEnum) : currentTableTopState.faceDirection,
      },
      reportPosition: { $set: false },
      robotIsPlaced: { $set: !placeError ? true : currentTableTopState.robotIsPlaced },
      xcoord: { $set: !placeError ? xcoord : currentTableTopState.xcoord },
      ycoord: { $set: !placeError ? ycoord : currentTableTopState.ycoord },
    });
    this.store.dispatch(updateTableTop({ newTableState: newTableTopState }));
    this.store.dispatch(addCommandRecord({ command: { command: fullString, error: !!placeError } }));
  }

  tryMoveRobot(command: CommandType, currentTableTopState: TableStateType): void {
    const { faceDirection, gridSize, robotIsPlaced, xcoord, ycoord } = currentTableTopState;

    let moveError = null;
    let x = xcoord;
    let y = ycoord;

    if (!robotIsPlaced || x === undefined || y === undefined) {
      moveError = 'Cannot move unplaced robot';
    } else {
      if (faceDirection === RobotFaceDirectionEnum.East) {
        x = x >= gridSize - 1 ? x : x + 1;
      } else if (faceDirection === RobotFaceDirectionEnum.North) {
        y = y >= gridSize - 1 ? y : y + 1;
      } else if (faceDirection === RobotFaceDirectionEnum.South) {
        y = y === 0 ? y : y - 1;
      } else if (faceDirection === RobotFaceDirectionEnum.West) {
        x = x === 0 ? x : x - 1;
      }
      moveError = x === xcoord && y === ycoord ? 'Cannot move robot off the table' : null;
    }

    this.error = moveError;
    if (!moveError) {
      const newTableTopState = update(currentTableTopState, {
        reportPosition: { $set: false },
        xcoord: { $set: x },
        ycoord: { $set: y },
      });
      this.store.dispatch(updateTableTop({ newTableState: newTableTopState }));
    }
    this.store.dispatch(addCommandRecord({ command: { command: command.fullString, error: !!moveError } }));
  }

  tryTurnRobot(command: CommandType, currentTableTopState: TableStateType): void {
    const { faceDirection, robotIsPlaced } = currentTableTopState;
    const { baseCommand, fullString } = command;

    let turnError = null;
    let newDir: RobotFaceDirectionEnum = faceDirection;

    if (robotIsPlaced && faceDirection) {
      if (faceDirection === RobotFaceDirectionEnum.East) {
        newDir = baseCommand === BaseCommandEnum.Left ? RobotFaceDirectionEnum.North : RobotFaceDirectionEnum.South;
      }
      if (faceDirection === RobotFaceDirectionEnum.North) {
        newDir = baseCommand === BaseCommandEnum.Left ? RobotFaceDirectionEnum.West : RobotFaceDirectionEnum.East;
      }
      if (faceDirection === RobotFaceDirectionEnum.South) {
        newDir = baseCommand === BaseCommandEnum.Left ? RobotFaceDirectionEnum.East : RobotFaceDirectionEnum.West;
      }
      if (faceDirection === RobotFaceDirectionEnum.West) {
        newDir = baseCommand === BaseCommandEnum.Left ? RobotFaceDirectionEnum.South : RobotFaceDirectionEnum.North;
      }
    } else {
      turnError = 'Cannot turn unplaced robot';
    }

    this.error = turnError;
    if (!turnError) {
      const newTableTopState = update(currentTableTopState, {
        faceDirection: { $set: newDir },
        reportPosition: { $set: false },
      });
      this.store.dispatch(updateTableTop({ newTableState: newTableTopState }));
    }
    this.store.dispatch(addCommandRecord({ command: { command: command.fullString, error: !!turnError } }));
  }

  tryReportPosition(command: CommandType, currentTableTopState: TableStateType): void {
    const { robotIsPlaced } = currentTableTopState;

    let reportError = null;
    if (!robotIsPlaced) {
      reportError = 'Cannot report position of unplaced robot';
    }

    this.error = reportError;
    const newTableTopState = update(currentTableTopState, {
      reportPosition: { $set: reportError ? false : true },
    });
    this.store.dispatch(updateTableTop({ newTableState: newTableTopState }));
    this.store.dispatch(addCommandRecord({ command: { command: command.fullString, error: !!reportError } }));
  }
}
