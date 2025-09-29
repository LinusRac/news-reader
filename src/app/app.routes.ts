import { Routes } from '@angular/router';
import { NewsList } from './news-list/news-list';
import { NewsEditor } from './news-editor/news-editor';
import { NewsViewer } from './news-viewer/news-viewer';

export const routes: Routes = [
    { path: '', redirectTo: '/list', pathMatch: 'full' },
    { path: 'list', component: NewsList },
    { path: 'view', component: NewsViewer },
    { path: 'edit', component: NewsEditor }
];
