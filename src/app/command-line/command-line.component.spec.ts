import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { CommandLineComponent } from './command-line.component';
import { CommandLineInputHandlerComponent } from '../command-line-input-handler/command-line-input-handler.component';
import { tableTopReducer } from '../store.reducers';
import { BaseCommandEnum, RobotFaceDirectionEnum } from '../../globalTypes';

describe('CommandLineComponent', () => {
  let component: CommandLineComponent;
  let fixture: ComponentFixture<CommandLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommandLineComponent, CommandLineInputHandlerComponent],
      imports: [FormsModule, StoreModule.forRoot({ tableTop: tableTopReducer })],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the command line', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('Please type your commands here:');
  });

  it('Should not allow a blank command', () => {
    const allowedCommands = Object.values(BaseCommandEnum) as string[];

    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.value).toBe('');

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.textContent).toBe('Enter');
    button.click();

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p.error').textContent).toContain(
      `Bad command, Please use one of: ${Object.values(allowedCommands).join(', ')}`
    );
  });

  it('Should not allow a command not in the Enum list', () => {
    const allowedCommands = Object.values(BaseCommandEnum) as string[];

    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'COMMANDO'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.error').textContent).toContain(
      `Bad command, Please use one of: ${Object.values(allowedCommands).join(', ')}`
    );
  });

  // PLACE
  it('Should not allow PLACE unless 4 arguments are in the command', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'PLACE 1 1'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.error').textContent).toContain('Bad Command: expected 4 arguments');
  });

  it('Should not allow bad X coordinate with PLACE', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'PLACE X 1 WEST'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.error').textContent).toContain(
      'Bad Command: X and Y coordinates must be integers'
    );
  });

  it('Should not allow bad Y coordinate with PLACE', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'PLACE 0 Y WEST'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.error').textContent).toContain(
      'Bad Command: X and Y coordinates must be integers'
    );
  });

  it('Should not allow invalid direction facing with PLACE', () => {
    const allowedDirections = Object.values(RobotFaceDirectionEnum) as string[];

    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'PLACE 2 2 NORF'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.error').textContent).toContain(
      `Bad Command: direction must be one of ${Object.values(allowedDirections).join(', ')}`
    );
  });

  it('Should not allow robot PLACE off the table', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'PLACE 2 9 EAST'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.error').textContent).toContain(
      'Bad Command: coordinates are off the table'
    );
  });

  // LEFT / RIGHT
  it('Should not allow unplaced robot to turn LEFT', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'LEFT'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.error').textContent).toContain('Cannot turn unplaced robot');
  });

  it('Should not allow unplaced robot to turn RIGHT', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'RIGHT'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.error').textContent).toContain('Cannot turn unplaced robot');
  });

  // REPORT
  it('Should not allow reporting before robot is placed', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'REPORT'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.error').textContent).toContain(
      'Cannot report position of unplaced robot'
    );
  });

  // MOVE
  it('No Robot on the Table shouldnt move', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'MOVE'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.error').textContent).toContain('Cannot move unplaced robot');
  });

  it('South Facing Robot at Y coord 0 should not move', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    input.value = 'PLACE 0 0 SOUTH'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    input.value = 'MOVE'; // COMMAND INPUT TEXT
    input.dispatchEvent(new Event('input'));

    button.click();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.error').textContent).toContain('Cannot move robot off the table');
  });
});
