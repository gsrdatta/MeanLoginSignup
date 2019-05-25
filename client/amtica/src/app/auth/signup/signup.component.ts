import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpIntercepterService } from 'src/app/http-intercepter.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @ViewChild('f') userForm: NgForm;
  userMdl: any = {};
  constructor(private http: HttpIntercepterService, private toastr: ToastrManager, private router: Router) { }

  ngOnInit() {
  }

  signUp() {
    this.http.postDataToServer('users', this.userMdl).subscribe(res => {
      this.toastr.successToastr(res.message, 'Success!');
      this.router.navigate(['/login']);
    })
    this.userForm.resetForm();
    this.userMdl = {};
  }

}
