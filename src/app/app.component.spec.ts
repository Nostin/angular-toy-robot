import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { CommandHistoryComponent } from './command-history/command-history.component';
import { CommandLineComponent } from './command-line/command-line.component';
import { CommandLineInputHandlerComponent } from './command-line-input-handler/command-line-input-handler.component';
import { HeaderComponent } from './header/header.component';
import { TableTopComponent } from './table-top/table-top.component';
import { tableTopReducer } from './store.reducers';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent,
        TableTopComponent,
        CommandLineComponent,
        CommandLineInputHandlerComponent,
        CommandHistoryComponent,
      ],
      imports: [FormsModule, StoreModule.forRoot({ tableTop: tableTopReducer })],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('Example A Should Report 0,1,NORTH', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    input.value = 'PLACE 0,0,NORTH'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    input.value = 'MOVE'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));
    button.click();

    input.value = 'REPORT'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));
    button.click();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p span').textContent).toContain('0,1,NORTH');
  });

  it('Example B Should Report 0,0,WEST', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    input.value = 'PLACE 0,0,NORTH'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    input.value = 'LEFT'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));
    button.click();

    input.value = 'REPORT'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));
    button.click();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p span').textContent).toContain('0,0,WEST');
  });

  it('Example C Should Report 3,3,NORTH', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    input.value = 'PLACE 1,2,EAST'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    input.value = 'MOVE'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));
    button.click();

    input.value = 'MOVE'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));
    button.click();

    input.value = 'LEFT'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));
    button.click();

    input.value = 'MOVE'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));
    button.click();

    input.value = 'REPORT'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));
    button.click();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p span').textContent).toContain('3,3,NORTH');
  });
});
