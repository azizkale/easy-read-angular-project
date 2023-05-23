import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';
import { PireditService } from 'src/app/services/piredit.service';
import { RolesService } from 'src/app/services/roles.service';
import { Pir } from 'src/models/Pir';
import { Roles } from 'src/models/Roles';

@Component({
  selector: 'app-piredit',
  templateUrl: './piredit.component.html',
  styleUrls: ['./piredit.component.css']
})
export class PireditComponent implements OnInit {
  addNewPirForm: FormGroup; // to add a pit to pirlist in db
  assignPirToMentorToEdit: FormGroup; // to assign apir from pirlist
  retrievePirForm: FormGroup;
  updatePirForm: FormGroup;
  pirs: Pir[] = [];
  mentorsMetoringGroups: any[]
  userId = localStorage.getItem('uid') // to determine user is allowed to edit pir

  allowedToAdminAndPirEditor: boolean;
  constructor(
    public fb: FormBuilder,
    private pireditservice: PireditService,
    private roleservice: RolesService,
    private groupservice: GroupService

  ) {
    this.roleservice.getUserRoles(localStorage.getItem('uid')).subscribe({
      next: (roles) => {
        console.log(roles)
        this.allowedToAdminAndPirEditor = roles.includes(Roles[1]) || roles.includes(Roles[4])
      }
    })
  }

  ngOnInit(): void {
    this.retrievePirsList()
    this.createPirRetrieveForm()
    this.createNewPirForm()
    this.createUpdatePirForm();
    this.createAssingPirForm();
  }

  createNewPirForm() {
    this.addNewPirForm = this.fb.group({
      pirName: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  createAssingPirForm() {
    this.assignPirToMentorToEdit = this.fb.group({
      pirName: ['', Validators.required],
      pirId: ['', Validators.required],
      description: ['', Validators.required],
      groupId: ['', Validators.required]
    });
    this.groupservice.retrieveAllGroupsOfTheMentor(localStorage.getItem('uid')).subscribe(({
      next: (groups) => { console.log(groups); this.mentorsMetoringGroups = groups }
    }))
  }

  createPirRetrieveForm() {
    this.retrievePirForm = this.fb.group({
    });
    //formname array is fullfilled in the retrievePirs function (below)

  }

  createUpdatePirForm() {
    this.updatePirForm = this.fb.group({
      pirId: ['', Validators.required],
      editorId: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  //adds newpir to 'pirs' node in db
  createNewPir() {
    const newPir = new Pir(
      null,
      localStorage.getItem('uid'),
      null,
      this.addNewPirForm.get('pirName')?.value,
      this.addNewPirForm.get('description')?.value,
      [],
      []
    )
    this.pireditservice.createPir(newPir).subscribe({
      next: (ress) => {
        this.retrievePirsList()
        this.createPirRetrieveForm()
      }
    })
  }

  retrievePirsList() {
    this.pirs = []
    this.pireditservice.retrievePirListToEditNewPir().subscribe({
      next: async (ress) => {
        if (ress) {
          await Object.values(ress).map((pir: Pir | any) => {
            this.pirs.push(pir)
          })
          // Sort the pirs array in ascending order based on name
          this.pirs.sort((a, b) => a.name.localeCompare(b.name));

          this.pirs.forEach((pir, index) => {
            this.retrievePirForm.addControl(pir.name, new FormControl(pir.name));
          });
        }
      }, complete: () => {
        console.log(this.pirs)
      }
    })
    // this.pireditservice.retrievePirs().subscribe({
    //   next: async (ress) => {
    //     if (ress) {
    //       await Object.values(ress).map((pir: Pir | any) => {
    //         this.pirs.push(pir)
    //       })
    //       this.pirs.forEach((pir, index) => {
    //         this.retrievePirForm.addControl(pir.name, new FormControl(pir.name));
    //       });
    //     }
    //   }, complete: () => {

    //   }
    // })
  }

  selectPirToUpdate(pir: Pir) {
    this.updatePirForm = this.fb.group({
      pirId: [pir.pirId, Validators.required],
      editorId: [pir.editorId, Validators.required],
      name: [pir.name, Validators.required],
      description: [pir.description, Validators.required]
    });
  }

  updatePir() {
    this.pireditservice.updatePir(this.updatePirForm.value).subscribe({
      next: (ress) => { this.retrievePirsList() }
    })

  }

  selectPirToAssing(pir: Pir) {
    this.assignPirToMentorToEdit = this.fb.group({
      pirName: [pir.name, Validators.required],
      pirId: [pir.pirId, Validators.required],
      description: [pir.description, Validators.required],
      groupName: ['', Validators.required],
      groupId: ['']
    });
  }

  assignPirToGroup(assignPirToMentorToEdit: any) {

    const newPir = new Pir(
      assignPirToMentorToEdit.pirId,
      localStorage.getItem('uid'),
      assignPirToMentorToEdit.groupId,
      assignPirToMentorToEdit.pirName,
      assignPirToMentorToEdit.description,
      [],
      []
    )
    this.pireditservice.assingPirToGroup(newPir).subscribe({
      next: (ress) => {
        this.retrievePirsList()
        this.createPirRetrieveForm()
      }
    })
  }

  deletePir() {
    this.pireditservice.deletePir(this.updatePirForm.get('pirId')?.value).subscribe({
      next: (ress) => {
        this.retrievePirsList()
        this.createPirRetrieveForm()
        console.log(ress)
      }
    })
  }
}