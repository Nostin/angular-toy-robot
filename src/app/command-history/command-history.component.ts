import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import type { CommandHistoryEntryType } from '../../globalTypes';

@Component({
  selector: 'app-command-history',
  templateUrl: './command-history.component.html',
  styleUrls: ['./command-history.component.css'],
})
export class CommandHistoryComponent {
  commandHistory$: Observable<CommandHistoryEntryType[]>;

  constructor(private store: Store<{ commandHistory: CommandHistoryEntryType[] }>) {
    this.commandHistory$ = store.pipe(select('commandHistory'));
  }
}
