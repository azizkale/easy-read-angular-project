import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from './services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthenticationService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        const token = localStorage.getItem('token');

        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    this.authService.signOut()
                }
                return throwError(error);
            })
        );
    }
}