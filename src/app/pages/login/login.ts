import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule], // 👈 aquí va
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm: FormGroup;

  
  constructor(private fb: FormBuilder,private router: Router , private api : Api) {
     this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      
    });
  }

  login() {
    console.log('form:',  this.loginForm.value);

     this.api.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
      next: (res) => {
        const token = res.token;
        localStorage.setItem('token', token);
        console.log("toekn",token) // guardas el token
        localStorage.setItem('rol', res.user.rol);
        localStorage.setItem('username', res.user.username);

        //Swal.fire('Login exitoso', 'Sesión iniciada', 'success');
        // Aquí podrías redirigir al usuario
        this.api.logeado();
     
        this.router.navigate(['/Inicio']);
        
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Credenciales incorrectas', 'error');
      }
    });
  }
}
