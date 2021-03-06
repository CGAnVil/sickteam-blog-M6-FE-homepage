import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './security/login/login.component';
import {RegisterComponent} from './security/register/register.component';
import {ChangePasswordComponent} from './unser-info-manage/change-password/change-password.component';
import {HomeComponent} from './shared/home/home.component';
import {PostManagerComponent} from './post-manage-by-user/post-manager/post-manager.component';
import {PostCreateComponent} from './post-manage-by-user/post-create/post-create.component';
import {PostDetailComponent} from "./post-manage-by-user/post-detail/post-detail.component";
import {InfoDetailComponent} from "./unser-info-manage/info-detail/info-detail.component";
import {InfoEditComponent} from "./unser-info-manage/info-edit/info-edit.component";
import {PostEditComponent} from "./post-manage-by-user/post-edit/post-edit.component";
import {PostFullDetailComponent} from "./post-full-detail/post-full-detail.component";

import {PostDetailCategoryComponent} from './post-detail-category/post-detail-category.component';

import {CreateCommentComponent} from './comment/create-comment/create-comment.component';




const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'change-password', component: ChangePasswordComponent},
  {path: 'user', component: PostManagerComponent},
  {path: '', component: HomeComponent},
  {path: 'createPost' , component: PostCreateComponent},
  {path:'posts/:id', component:PostDetailComponent},
  {path:'user/profile', component: InfoDetailComponent},
  {path:'user/:id', component:InfoEditComponent},
  {path:'posts/edit/:id', component:PostEditComponent},
  {path:'posts/details/:id', component:PostFullDetailComponent},

  {path:'posts/details/category/:id' , component:PostDetailCategoryComponent},


  {path:'createComment/:id', component:CreateCommentComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

