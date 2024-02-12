import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoldersComponent } from './components/folders/folders.component';
import { ImpnotesComponent } from './components/impnotes/impnotes.component';
import { LoginComponent } from './components/login/login.component';
import { NotesComponent } from './components/notes/notes.component';

const routes: Routes = [
    {path : '',redirectTo : 'notes',pathMatch : 'full'},
   {path: 'notes',   component:NotesComponent},  //canActivate:[AuthGuard]}, // },
    {path:'login', component:LoginComponent},
    {path:'impo',  component:ImpnotesComponent },//canActivate:[AuthGuard]},// },
    {path:'folder',  component:FoldersComponent} //canActivate:[AuthGuard]},// },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
