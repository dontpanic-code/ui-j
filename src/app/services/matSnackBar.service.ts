import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class MatSnackBarService {
    constructor(private matSnackBar: MatSnackBar) {
    }

    showMessage(message: string, duration = 5000) {
        this.matSnackBar.open(message, 'OK', {
            verticalPosition: 'bottom',
            duration
        });
    }
}