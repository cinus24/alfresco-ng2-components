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

import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ContentService } from '../../services/content.service';

@Component({
    selector: 'adf-media-player',
    templateUrl: './mediaPlayer.component.html',
    styleUrls: ['./mediaPlayer.component.scss'],
    host: { 'class': 'adf-media-player' },
    encapsulation: ViewEncapsulation.None
})
export class MediaPlayerComponent implements OnChanges {

    @Input()
    urlFile: string;

    @Input()
    blobFile: Blob;

    @Input()
    mimeType: string;

    @Input()
    nameFile: string;

    constructor(private contentService: ContentService ) {}

    ngOnChanges(changes: SimpleChanges) {
        let blobFile = changes['blobFile'];
        if (blobFile && blobFile.currentValue) {
            this.urlFile = this.contentService.createTrustedUrl(this.blobFile);
            return;
        }

        if (!this.urlFile && !this.blobFile) {
            throw new Error('Attribute urlFile or blobFile is required');
        }
    }
}
