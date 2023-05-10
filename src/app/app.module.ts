import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AuthGuard } from './Auth.Guard';
import { AuthInterceptor } from './auth.interceptor';

// ================Angular material modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


//================ng-bootstrap (https://ng-bootstrap.github.io/)
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

//================Components=========
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';
import { MeComponent } from './me/me.component';
import { BooktableComponent } from './me/booktable/booktable.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BooklistComponent } from './me/booklist/booklist.component';
import { GrouplistComponent } from './me/grouplist/grouplist.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HatimComponent } from './works/hatim/hatim.component';
import { SettingsComponent } from './settings/settings.component';
import { LeftColumnComponent } from './left-column/left-column.component';
import { ShbComponent } from './works/shb/shb.component';
import { PireditComponent } from './works/piredit/piredit.component';
import { ChaptereditComponent } from './works/piredit/chapteredit/chapteredit.component';
import { DisplayComponent } from './Display/display.component';
import { DisplaypirComponent } from './Display/displaypir/displaypir.component';
import { ChaptersComponent } from './Display/displaypir/chapters/chapters.component';
import { ChapterContentComponent } from './Display/displaypir/chapters/chapter-content/chapter-content.component';
import { DialogComponent } from './dialog/dialog.component';
import { WordpaireditComponent } from './works/piredit/wordpairedit/wordpairedit.component';
import { AdminsettingsComponent } from './settings/adminsettings/adminsettings.component';
import { GroupComponent } from './group/group.component';
import { GroupsidebarComponent } from './groupsidebar/groupsidebar.component';
import { GroupinfoComponent } from './group/groupinfo/groupinfo.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    RegisterComponent,
    BooklistComponent,
    BooktableComponent,
    MeComponent,
    GrouplistComponent,
    SidebarComponent,
    HatimComponent,
    SettingsComponent,
    LeftColumnComponent,
    ShbComponent,
    PireditComponent,
    ChaptereditComponent,
    DisplayComponent,
    DisplaypirComponent,
    ChaptersComponent,
    ChapterContentComponent,
    DialogComponent,
    WordpaireditComponent,
    AdminsettingsComponent,
    GroupComponent,
    GroupsidebarComponent,
    GroupinfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatGridListModule,
    NgbPopoverModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule,
  ],
  providers: [
    AuthGuard,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
