import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpIntercepterService } from 'src/app/http-intercepter.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  @ViewChild('f') userForm: NgForm;
  userMdl: any = {};
  constructor(private http: HttpIntercepterService, private toastr: ToastrManager, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.http.postDataToServer('users/login', this.userMdl).subscribe(res => {
      localStorage.setItem("auth", res.user.token);
      this.toastr.successToastr(res.message, 'Success!');
      this.router.navigate(['/home']);
    })
    this.userForm.resetForm();
    this.userMdl = {};
  }
}
