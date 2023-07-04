import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DisplaypirService } from 'src/app/services/displaypir.service';
import { Pir } from 'src/models/Pir';

@Component({
  selector: 'app-displaypir',
  templateUrl: './displaypir.component.html',
  styleUrls: ['./displaypir.component.css']
})
export class DisplaypirComponent implements OnInit {
  retrievePirForm: FormGroup;
  pirs: Pir[] = [];

  constructor(
    public fb: FormBuilder,
    private displaypirservice: DisplaypirService
  ) { }

  ngOnInit(): void {
    this.formPirRetrieve()
    this.retrievePirsNames()
  }

  formPirRetrieve() {
    this.retrievePirForm = this.fb.group({
      // pirName: this.fb.array([]),
    });
    //formname array is fullfilled in the retrievePirs function (below)
  }
  retrievePirsNames() {
    this.pirs = []
    this.displaypirservice.retrievePirsNames().subscribe({
      next: async (ress) => {
        if (ress) {
          await Object.values(ress).map((pir: Pir | any) => {
            this.pirs.push(pir)
          })
          await this.pirs.sort((a, b) => a.name?.localeCompare(b.name));

          this.pirs.forEach((pir, index) => {
            this.retrievePirForm.addControl(pir.name, new FormControl(pir.name));
          });
        }
      }
    })
  }
}
