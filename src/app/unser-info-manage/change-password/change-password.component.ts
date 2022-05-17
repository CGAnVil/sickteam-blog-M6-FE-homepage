import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';
import {AuthService} from '../../service/auth/auth.service';
import {Router} from '@angular/router';
import {TokenService} from '../../service/auth/token.service';
import {ResponeBody} from '../../model/respone-body';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  status = 'Please fill in the form to change your password';
  myForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  isChangePassed = false;
  isHiddenPassword = true;
  isChecking = true;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService) {
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmNewPassword: ['']
      }, {validator: this.checkPasswords},
    );
  }

  checkPasswords(group: FormGroup) {
    const newPassword = group.controls.newPassword.value;
    const confirmPass = group.controls.confirmNewPassword.value;

    return newPassword === confirmPass ? null : {notSame: true};
  }

  get currentPassword(): string {
    return this.myForm.get('currentPassword').value;
  }

  get newPassword(): string {
    return this.myForm.get('newPassword').value;
  }

  get confirmNewPassword(): string {
    return this.myForm.get('confirmNewPassword').value;
  }

  ngSubmit() {
    this.authService
      .changePassword(this.myForm.value)
      .subscribe(
        (response: ResponeBody) => {
          if (response.message === 'ok') {
            this.isChangePassed = true;
            console.log('data trong if', response);
            console.log('ischangePass', this.isChangePassed);
            this.status = 'Change Password success!';
          } else {
            this.status = 'Change Password fail!';
            this.isChangePassed = false;
            this.isChecking = false;
          }
        }, error => {
          alert('khong duoc');
          this.status = 'Loi may chu hoac loi khong xac dinh!';
        }
      );
  }
}
