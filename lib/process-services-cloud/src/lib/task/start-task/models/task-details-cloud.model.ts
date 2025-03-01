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

export class TaskDetailsCloudModel {

    id: string;
    name: string;
    appName: string;
    assignee: string;
    appVersion: string;
    createdDate: Date;
    claimedDate: Date;
    formKey: any;
    category: any;
    description: string;
    dueDate: Date;
    lastModified: Date;
    lastModifiedTo: Date;
    lastModifiedFrom: Date;
    owner: any;
    parentTaskId: number;
    priority: number;
    processDefinitionId: string;
    processInstanceId: string;
    status: TaskStatusEnum;
    standAlone: boolean;
    candidateUsers: string[];
    candidateGroups: string[];
    managerOfCandidateGroup: boolean;
    memberOfCandidateGroup: boolean;
    memberOfCandidateUsers: boolean;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || null;
            this.name = obj.name || null;
            this.appName = obj.appName || null;
            this.assignee = obj.assignee || null;
            this.appVersion = obj.appVersion || null;
            this.createdDate = obj.createdDate || null;
            this.claimedDate = obj.claimedDate || null;
            this.formKey = obj.formKey || null;
            this.description = obj.description || null;
            this.dueDate = obj.dueDate || null;
            this.lastModified = obj.lastModified || null;
            this.lastModifiedTo = obj.lastModifiedTo || null;
            this.lastModifiedFrom = obj.lastModifiedFrom || null;
            this.owner = obj.owner || null;
            this.parentTaskId = obj.parentTaskId || null;
            this.priority = obj.priority || null;
            this.processDefinitionId = obj.processDefinitionId || null;
            this.processInstanceId = obj.processInstanceId || null;
            this.status = obj.status || null;
            this.standAlone = obj.standAlone || null;
            this.candidateUsers = obj.candidateUsers || null;
            this.candidateGroups = obj.candidateGroups || null;
            this.managerOfCandidateGroup = obj.managerOfCandidateGroup || null;
            this.memberOfCandidateGroup = obj.memberOfCandidateGroup || null;
            this.memberOfCandidateUsers = obj.memberOfCandidateUsers || null;
        }
    }

    isCompleted() {
        return this.status && this.status === TaskStatusEnum.COMPLETED;
    }
}

export interface StartTaskCloudResponseModel {
    entry: TaskDetailsCloudModel;
}

export enum TaskStatusEnum {
    COMPLETED=  'COMPLETED',
    DELETED = 'DELETED',
    CREATED = 'CREATED',
    ASSIGNED = 'ASSIGNED',
    SUSPENDED = 'SUSPENDED',
    CANCELLED = 'CANCELLED'
}
