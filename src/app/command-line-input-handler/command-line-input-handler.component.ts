import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { CommandType } from '../../globalTypes';

@Component({
  selector: 'app-command-line-input-handler',
  templateUrl: './command-line-input-handler.component.html',
  styleUrls: ['./command-line-input-handler.component.css'],
})
export class CommandLineInputHandlerComponent {
  @Input() error: string | null = null;
  @Output() commandIssued = new EventEmitter<CommandType>();

  command = '';

  onPressEnter(event): void {
    if (event.code && event.code === 'Enter') {
      this.issueCommand();
    }
  }

  issueCommand(): void {
    const [baseCommand, xcoord, ycoord, faceDirection] = this.command.trim().toUpperCase().split(/[ ,]+/);
    const parsedCommand = {
      baseCommand,
      error: null,
      faceDirection: faceDirection ? faceDirection : undefined,
      fullString: this.command,
      xcoord: xcoord ? parseInt(xcoord, 10) : undefined,
      ycoord: ycoord ? parseInt(ycoord, 10) : undefined,
    } as CommandType;

    this.commandIssued.emit(parsedCommand);

    this.command = '';
  }
}
