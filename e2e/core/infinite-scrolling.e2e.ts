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

import { LoginPage } from '../pages/adf/loginPage';
import { ContentServicesPage } from '../pages/adf/contentServicesPage';

import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FolderModel } from '../models/ACS/folderModel';

import TestConfig = require('../test.config');
import { Util } from '../util/util';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../actions/ACS/upload.actions';

describe('Enable infinite scrolling', () => {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();

    let acsUser = new AcsUserModel();
    let folderModel = new FolderModel({ 'name': 'folderOne' });

    let fileNames = [], nrOfFiles = 21, deleteFileNames = [], nrOfDeletedFiles = 22;
    let deleteUploaded;

    let files = {
        base: 'newFile',
        extension: '.txt'
    };

    beforeAll(async (done) => {
        let uploadActions = new UploadActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        fileNames = Util.generateSequenceFiles(1, nrOfFiles, files.base, files.extension);
        deleteFileNames = Util.generateSequenceFiles(1, nrOfDeletedFiles, files.base, files.extension);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        let folderUploadedModel = await uploadActions.createFolder(this.alfrescoJsApi, folderModel.name, '-my-');

        await uploadActions.createEmptyFiles(this.alfrescoJsApi, fileNames, folderUploadedModel.entry.id);

        deleteUploaded = await uploadActions.createFolder(this.alfrescoJsApi, 'deleteFolder', '-my-');

        await uploadActions.createEmptyFiles(this.alfrescoJsApi, deleteFileNames, deleteUploaded.entry.id);

        done();
    });

    beforeEach(async (done) => {
        contentServicesPage.goToDocumentList();
        done();
    });

    it('[C260484] Should be possible to enable infinite scrolling', () => {
        contentServicesPage.doubleClickRow(folderModel.name);
        contentServicesPage.enableInfiniteScrolling();
        contentServicesPage.clickLoadMoreButton();
        for (let i = 0; i < nrOfFiles; i++) {
            contentServicesPage.checkContentIsDisplayed(fileNames[i]);
        }
    });

    it('[C268165] Delete folder when infinite scrolling is enabled', () => {
        contentServicesPage.doubleClickRow(deleteUploaded.entry.name);
        contentServicesPage.checkAcsContainer();
        contentServicesPage.waitForTableBody();
        contentServicesPage.enableInfiniteScrolling();
        contentServicesPage.clickLoadMoreButton();
        for (let i = 0; i < nrOfDeletedFiles; i++) {
            contentServicesPage.checkContentIsDisplayed(deleteFileNames[i]);
        }
        expect(contentServicesPage.getContentList().dataTablePage().numberOfRows()).toEqual(nrOfDeletedFiles);

        contentServicesPage.deleteContent(deleteFileNames[nrOfDeletedFiles - 1]);
        contentServicesPage.checkContentIsNotDisplayed(deleteFileNames[nrOfDeletedFiles - 1]);

        for (let i = 0; i < nrOfDeletedFiles - 1; i++) {
            contentServicesPage.checkContentIsDisplayed(deleteFileNames[i]);
        }
    });

});
