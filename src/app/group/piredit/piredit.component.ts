import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';
import { PireditService } from 'src/app/services/piredit.service';
import { Pir } from 'src/models/Pir';
import { PirType_ } from 'src/models/PirType';

@Component({
  selector: 'app-piredit',
  templateUrl: './piredit.component.html',
  styleUrls: ['./piredit.component.css'],
})
export class PireditComponent implements OnInit {
  addNewPirForm: FormGroup; // to add a pit to pirlist in db
  assignPirToMentorToEdit: FormGroup; // to assign apir from pirlist
  retrievePirForm: FormGroup;
  pirs: Pir[] | any[] = [];
  mentorsMetoringGroups: any[]; //to display in template
  userId = localStorage.getItem('uid'); // to determine user is allowed to edit pir
  pirTypes: any;
  constructor(
    public fb: FormBuilder,
    private pireditservice: PireditService,
    private groupservice: GroupService
  ) {}

  ngOnInit(): void {
    this.retrievePirsList();
    this.createPirRetrieveForm();
    this.createNewPirForm();
    this.createAssingPirForm();
    this.pirTypes = Object.values(PirType_);
  }

  createNewPirForm() {
    this.addNewPirForm = this.fb.group({
      pirName: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      author: ['', Validators.required],
      type: ['', Validators.required],
      allowed: [true, Validators.required],
    });
  }

  createAssingPirForm() {
    this.assignPirToMentorToEdit = this.fb.group({
      pirName: ['', Validators.required],
      pirId: ['', Validators.required],
      description: ['', Validators.required],
      groupId: ['', Validators.required],
      author: ['', Validators.required],
      type: ['', Validators.required],
      allowed: [true, Validators.required],
    });
    this.groupservice
      .retrieveAllGroupsOfTheMentor(localStorage.getItem('uid'))
      .subscribe({
        next: (groups) => {
          this.mentorsMetoringGroups = groups;
        },
      });
  }

  createPirRetrieveForm() {
    this.retrievePirForm = this.fb.group({});
    //formname array is fullfilled in the retrievePirsList function (below)
  }

  //adds newpir to 'pirs' node in db
  createNewPir() {
    let newPir = new Pir(
      null,
      localStorage.getItem('uid'),
      null,
      this.addNewPirForm.get('pirName')?.value,
      this.addNewPirForm.get('description')?.value,
      [],
      [],
      this.addNewPirForm.get('imageUrl')?.value
    );

    newPir.allowed = this.addNewPirForm.get('allowed')?.value;
    newPir.author = this.addNewPirForm.get('author')?.value;
    newPir.type = this.addNewPirForm.get('type')?.value;
    this.pireditservice.createPir(newPir).subscribe({
      next: (ress) => {
        this.retrievePirsList();
        this.createPirRetrieveForm();
      },
    });
  }

  retrievePirsList() {
    this.pirs = [];
    this.pireditservice.retrievePirList().subscribe({
      next: async (ress) => {
        if (ress) {
          await Object.values(ress).forEach(async (pir, index) => {
            await this.retrievePirForm.addControl(
              pir.name,
              new FormControl(pir.name)
            );
            await this.pirs.push(pir);
          });

          // Sort the pirs array in ascending order based on name
          await this.pirs.sort((a, b) => a.name?.localeCompare(b.name));
        }
      },
      complete: () => {},
    });
  }

  selectPirToAssing(pir: Pir | any) {
    this.assignPirToMentorToEdit = this.fb.group({
      pirName: [pir.name, Validators.required],
      pirId: [pir.pirId, Validators.required],
      description: [pir.description, Validators.required],
      groupName: ['', Validators.required],
      groupId: [''],
    });
  }

  assignPirToGroup(assignPirToMentorToEditForm: any) {
    this.pireditservice
      .retrievePirByPirId(assignPirToMentorToEditForm.pirId)
      .subscribe({
        next: async (pir: any) => {
          await this.pireditservice
            .assingPirToGroup(pir, assignPirToMentorToEditForm.groupId)
            .subscribe({
              next: (ress) => {
                this.retrievePirsList();
                this.createPirRetrieveForm();
              },
            });
        },
      });
  }
}
