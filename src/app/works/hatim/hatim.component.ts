import { Component, OnInit } from '@angular/core';
import { HatimService } from 'src/app/services/hatim.service';
import { cuz } from 'src/models/cuz';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-hatim',
  templateUrl: './hatim.component.html',
  styleUrls: ['./hatim.component.css']
})

export class HatimComponent implements OnInit {
  cuzs: cuz[] | any = [];
  name: string | any = localStorage.getItem('displayName');
  innerWidth = window.innerWidth;
  roles: string[];
  constructor(
    private hatimservice: HatimService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private common: CommonService
  ) { }

  ngOnInit(): void {
    this.retrieveCuzs();
    this.roles = this.common.getRoles();
  }
  retrieveCuzs() {
    this.hatimservice.retrieveHatim().subscribe({
      next: (response) => {
        //data comes from db with a null object (cuzs[0] = null)
        Object.values(response['cuzs']).map((cuz: cuz | any) => {
          if (cuz !== null)
            this.cuzs.push(cuz)
        })
      },
      error: (err) => {
        if (err.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['signin']);
        }
      },
      complete: () => {
      }
    })
  }

  hatimAlert(reader: string | any) {
    this._snackBar.open(`Bu cüz ${reader} tarafindan alınmıştır!`, 'X', {
      duration: 2 * 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['cuz']
    });
  }

  getCuz(cuz: cuz, index: number) {
    if (cuz.reader === '' && cuz.beingRead === false && cuz.complete === false) {
      cuz.reader = this.name;
      cuz.beingRead = true
      this.hatimservice.updateHatim(cuz, index + 1).subscribe({
        next: (response: cuz) => {
          console.log(response)
        }
      })
    }
  }

  leaveCuz(cuz: cuz, index: number) {
    if (cuz.reader !== '' && cuz.reader === this.name) {
      cuz.beingRead = false;
      cuz.complete = false;
      cuz.reader = '';
      this.hatimservice.updateHatim(cuz, index + 1).subscribe({
        next: (data) => { console.log(data) }
      })
    }
    else this.hatimAlert(cuz.reader)

  }

  completeCuz(cuz: cuz, index: number) {
    cuz.beingRead = true;
    cuz.complete = true;
    this.hatimservice.updateHatim(cuz, index + 1).subscribe({
      next: (data) => { console.log(data) }
    })
  }

  resetHatim() {
    // this.hatimservice.createHatim().subscribe({ next: () => { } })
    console.log(this.common.getRoles())
  }
}

