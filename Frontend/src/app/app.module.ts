import { NgModule } from '@angular/core';
import {environment} from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SocialLoginModule, SocialAuthServiceConfig,GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import {GoogleLoginProvider} from '@abacritt/angularx-social-login';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar'; 
import { HttpClientModule } from '@angular/common/http';
  import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { ColorPickerModule } from 'ngx-color-picker';
import {MatTabsModule} from '@angular/material/tabs';
// import { PipePipe } from './pipe.pipe';
import {MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {CdkTreeModule} from '@angular/cdk/tree';
import { MatTreeModule } from '@angular/material/tree';
import { AuthService } from './services/auth.service';
import { NotesComponent } from './components/notes/notes.component';
import { ImpnotesComponent } from './components/impnotes/impnotes.component';
import { FoldersComponent } from './components/folders/folders.component';
import { DocumentViewComponent } from './components/document-view/document-view.component';
import { UsersService } from './services/users.service';
import { CimgdataService } from './services/cimgdata.service';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MatRippleModule } from '@angular/material/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDialogModule} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ResizableModule } from 'angular-resizable-element';
import {DragDropModule} from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotesComponent,
    ImpnotesComponent,
    FoldersComponent,
    DocumentViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    HttpClientModule,
    MatTabsModule,
    MatMenuModule,
    MatExpansionModule,
    MatIconModule,
    CdkTreeModule,
    MatTreeModule,
    NgxDocViewerModule,
    ColorPickerModule,
    NgxMatColorPickerModule,
    MatRippleModule,
    MatGridListModule,
    MatDialogModule,
    MatInputModule,
    FlexLayoutModule,
    ResizableModule,
    DragDropModule
  ],
  providers: [AuthService,AuthService,UsersService, CimgdataService, DocumentViewComponent,
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS } ,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        windowType: 'page',
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              `${environment.GLp_ID}`,
            ),
          }
          
        ],
        onError: (err) => {
          console.error("error");
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

