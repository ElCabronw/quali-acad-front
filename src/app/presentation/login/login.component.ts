import { Component,OnInit } from '@angular/core';
import {FormControl,FormGroup,Validator} from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  submitted = false;
/**
 *
 */
constructor(private router: Router) {
}
  ngOnInit(){
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    });
  }

  onSubmit(){
    this.submitted = true;
    if(this.loginForm.invalid){
      return;
    }
    //redirect to home component
    this.router.navigate(['/home']);

  }
}

