/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DebugElement, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { FormModule, setupTestBed } from '@alfresco/adf-core';
import { TaskListModule } from '../../task-list/task-list.module';

import { ProcessInstance } from '../models/process-instance.model';
import { exampleProcess, exampleProcessNoName } from './../../mock';
import { ProcessService } from './../services/process.service';
import { ProcessInstanceDetailsComponent } from './process-instance-details.component';
import { ProcessTestingModule } from '../../testing/process.testing.module';

describe('ProcessInstanceDetailsComponent', () => {

    let service: ProcessService;
    let component: ProcessInstanceDetailsComponent;
    let fixture: ComponentFixture<ProcessInstanceDetailsComponent>;
    let getProcessSpy: jasmine.Spy;

    setupTestBed({
        imports: [
            ProcessTestingModule,
            FormModule,
            TaskListModule
        ],
        providers: [
            ProcessService
        ],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {

        fixture = TestBed.createComponent(ProcessInstanceDetailsComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ProcessService);

        getProcessSpy = spyOn(service, 'getProcess').and.returnValue(of(exampleProcess));
    });

    it('should not load task details when no processInstanceId is specified', () => {
        fixture.detectChanges();
        expect(getProcessSpy).not.toHaveBeenCalled();
    });

    it('should set a placeholder message when processInstanceId not initialised', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.innerText).toBe('ADF_PROCESS_LIST.DETAILS.MESSAGES.NONE');
    });

    it('should display a header when the processInstanceId is provided', async(() => {
        fixture.detectChanges();
        component.ngOnChanges({ 'processInstanceId': new SimpleChange(null, '123', true) });
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let headerEl: DebugElement = fixture.debugElement.query(By.css('.mat-card-title '));
            expect(headerEl).not.toBeNull();
            expect(headerEl.nativeElement.innerText).toBe('Process 123');
        });
    }));

    it('should display default details when the process instance has no name', async(() => {
        getProcessSpy = getProcessSpy.and.returnValue(of(exampleProcessNoName));
        fixture.detectChanges();
        component.ngOnChanges({ 'processInstanceId': new SimpleChange(null, '123', true) });
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let headerEl: DebugElement = fixture.debugElement.query(By.css('.mat-card-title '));
            expect(headerEl).not.toBeNull();
            expect(headerEl.nativeElement.innerText).toBe('My Process - Nov 10, 2016, 3:37:30 AM');
        });
    }));

    describe('change detection', () => {

        let change = new SimpleChange('123', '456', true);
        let nullChange = new SimpleChange('123', null, true);

        beforeEach(async(() => {
            component.processInstanceId = '123';
            fixture.detectChanges();
            component.tasksList = jasmine.createSpyObj('tasksList', ['load']);
            fixture.whenStable().then(() => {
                getProcessSpy.calls.reset();
            });
        }));

        it('should fetch new process details when processInstanceId changed', () => {
            component.ngOnChanges({ 'processInstanceId': change });
            expect(getProcessSpy).toHaveBeenCalledWith('456');
        });

        it('should NOT fetch new process details when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getProcessSpy).not.toHaveBeenCalled();
        });

        it('should NOT fetch new process details when processInstanceId changed to null', () => {
            component.ngOnChanges({ 'processInstanceId': nullChange });
            expect(getProcessSpy).not.toHaveBeenCalled();
        });

        it('should set a placeholder message when processInstanceId changed to null', () => {
            component.ngOnChanges({ 'processInstanceId': nullChange });
            fixture.detectChanges();
            expect(fixture.nativeElement.innerText).toBe('ADF_PROCESS_LIST.DETAILS.MESSAGES.NONE');
        });

        it('should display cancel button if process is running', () => {
            component.processInstanceDetails = new ProcessInstance({
                ended: null
            });
            fixture.detectChanges();
            let buttonEl = fixture.debugElement.query(By.css('[data-automation-id="header-status"] button'));
            expect(buttonEl).not.toBeNull();
        });

        describe('Diagram', () => {

            it('should diagram button be enabled if the process is running', async(() => {
                component.processInstanceDetails = new ProcessInstance({
                    ended: null
                });
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    let diagramButton = fixture.debugElement.query(By.css('#show-diagram-button'));
                    expect(diagramButton).not.toBeNull();
                    expect(diagramButton.nativeElement.disabled).toBe(false);
                });
            }));

            it('should diagram button be enabled if the process is running', async(() => {
                component.processInstanceDetails = new ProcessInstance({
                    ended: new Date()
                });

                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    let diagramButton = fixture.debugElement.query(By.css('#show-diagram-button'));
                    expect(diagramButton).not.toBeNull();
                    expect(diagramButton.nativeElement.disabled).toBe(true);
                });
            }));
        });
    });
});
