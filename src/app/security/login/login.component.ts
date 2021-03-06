import { Component, OnInit } from '@angular/core';
import {SignInForm} from '../../model/sign-in-form';
import {User} from '../../model/user';
import {AuthService, Role} from '../../service/auth/auth.service';
import {TokenService} from '../../service/auth/token.service';
import {Router} from '@angular/router';
import {UserStatus} from './user-status.enum';

import {ToastService} from "../../toast/toast.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  status = '';
  form: any = {};
  signInForm!: SignInForm;
  hide = true;
  isLoggedIn = false;
  isLoginFailed = false;
  role!: string;
  checkBlock = false;
  nameLogin!: string;
  error1: any = {
    message: 'notfounduser'
  };

  user!: User;

  constructor(private authService: AuthService,
              private tokenService: TokenService,
              private router: Router,

              private toastService: ToastService
              ) {

  }

  roles: string[] = [];
  name!: string;

  ngOnInit(): void {
  }

  ngSubmit() {
    this.signInForm = new SignInForm(
      this.form.username,
      this.form.password
    );
    this.authService.findUserByUsername(this.form.username).subscribe(user => {
      console.log(user);
      if (JSON.stringify(user) == JSON.stringify(this.error1)) {
        this.status = 'Không tìm thấy tên người dùng';
      }
      console.log(user.status.name === UserStatus.ACTIVE);

      if (user.status.name === UserStatus.INACTIVE) {
        this.checkBlock = true;
        this.status = 'Tài khoản đã bị chặn';
        this.router.navigate(['/login']).then(() => {
          window.location.reload();
          })
        } else {
          this.authService.signIn(this.signInForm).subscribe(data => {
              console.log('data', data);
              if (data.token != undefined) {
                this.tokenService.setToken(data.token);
                this.tokenService.setName(data.fullName);
                this.name = this.tokenService.getName();
                this.tokenService.setRoles(data.roles);
                this.isLoginFailed = false;
                this.isLoggedIn = true;
                this.nameLogin = data.fullName;
                for (let i = 0; i < data.roles.length; i++) {
                  if (data.roles[i]['authority'] === 'ADMIN') {
                    this.role = Role.Admin;
                  } else if (data.roles[i]['authority'] === 'USER') {
                    this.role = Role.User;
                  }
                }
                this.user = user;
                console.log('thong tin user: ', user);
                localStorage.setItem("userLogin", JSON.stringify(this.user));
                localStorage.setItem("nameLogin", this.nameLogin);
                localStorage.setItem("roleLogin", this.role);
                this.router.navigate(['']).then(() => {
                  window.location.reload();
                });

              } else {
                this.isLoggedIn = false;
                this.isLoginFailed = true;
                console.log('loginFailed', this.isLoginFailed);
                console.log('isLoggedIn', this.isLoggedIn);
                this.status = 'Đăng nhập thất bại! Vui lòng thử lại!';
              }
            }, error => {
              console.log('error', error);
              this.status = "Người dùng hoặc mật khẩu không đúng"
              this.isLoginFailed = true;
            }
          )
        }

      }
    );

  }


  public checkBlockLogin(username: any) {

  }

  public findUserByUsername(username: any) {

  }

  response;

  loginGoogle() {
    // this.auth.signInWithPopup();
    // this.authService.findUserByUsername(this.form.username).subscribe(gg =>{
    //   if (gg.status.name == UserStatus.ACTIVE) {
    //     this.checkBlock = true;
    //     this.router.navigate([''])
    //   } else {
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(result => {
          // The firebase.User instance:
          const user = result.user;
          // The Facebook firebase.auth.AuthCredential containing the Facebook
          // access token:
          const credential = result.credential;
          console.log(user);
          console.log(credential);
          this.authService.signInSocial({type: 'google', email: user.email}).subscribe(resp => {
            console.log(resp, 'resp');
            // tslint:disable-next-line:triple-equals
            if (resp.token != undefined) {
              this.tokenService.setToken(resp.token);
              this.tokenService.setName(resp.fullName);
              this.name = this.tokenService.getName();
              this.tokenService.setRoles(resp.roles);
              this.isLoginFailed = false;
              this.isLoggedIn = true;
              this.nameLogin = resp.fullName;
              for (let i = 0; i < resp.roles.length; i++) {
                if (resp.roles[i]['authority'] === 'ADMIN') {
                  this.role = Role.Admin;
                } else if (resp.roles[i]['authority'] === 'USER') {
                  this.role = Role.User;
                }
              }
              localStorage.setItem("userLogin", JSON.stringify(this.user));
              localStorage.setItem("nameLogin", this.nameLogin);
              localStorage.setItem("roleLogin", this.role);
              this.router.navigate(['']).then(() => {
                window.location.reload();
              });

            }
            localStorage.setItem('socialusers', JSON.stringify(resp));
            this.router.navigate([''])
          });
        }, error => {
          // The provider's account email, can be used in case of
          // auth/account-exists-with-different-credential to fetch the providers
          // linked to the email:
          var email = error.email;
          // The provider's credential:
          var credential = error.credential;
          // In case of auth/account-exists-with-different-credential error,
          // you can fetch the providers using this:
          if (error.code === 'auth/account-exists-with-different-credential') {
            this.afAuth.auth.fetchSignInMethodsForEmail(email).then(function(providers) {
              //     // The returned 'providers' is a list of the available providers
              //     // linked to the email address. Please refer to the guide for a more
              //     // complete explanation on how to recover from this error.
            });
          }
        });
      }
  //   })
  // }


}
