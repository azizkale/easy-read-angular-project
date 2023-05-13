import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';
import { UserService } from 'src/app/services/user.service';
import { Group } from 'src/models/Group';
import { Roles } from 'src/models/Roles';

@Component({
  selector: 'groupsettings',
  templateUrl: './groupsettings.component.html',
  styleUrls: ['./groupsettings.component.css']
})
export class GroupsettingsComponent implements OnInit {
  @ViewChild('participantemail_', { static: false }) participantemail_: ElementRef
  @ViewChild('participantid_', { static: false }) participantid_: ElementRef
  createGroupForm: FormGroup
  retrieveGroupsForm: FormGroup
  updateGroupForm: FormGroup
  groups: Group[];

  constructor(
    private fb: FormBuilder,
    private groupservice: GroupService,
    private userservice: UserService
  ) { }

  ngOnInit(): void {
    this.retrieveGroups()
    this.createCreateNewGroupForm();
    this.createReteiveGroupsForm();
    this.createUpdateGroupForm();
  }

  // forms=====================
  createCreateNewGroupForm() {
    this.retrieveGroupsForm = this.fb.group({
      groupName: ['', Validators.required],
      mentorEmail: ['', Validators.required],
    });
  }
  createReteiveGroupsForm() {
    this.createGroupForm = this.fb.group({
      groupId: ['', Validators.required],
      groupName: ['', Validators.required],
      mentorEmail: ['', Validators.required],
    });
  }
  createUpdateGroupForm() {
    this.updateGroupForm = this.fb.group({
      groupId: ['', Validators.required],
      mentorId: ['', Validators.required],
      groupName: ['', Validators.required],
      mentorEmail: ['', Validators.required],
    });
    this.groups.forEach((group: Group, index) => {
      group.participants.forEach((user) => {
        this.updateGroupForm.addControl(user.userName, new FormControl(user.userName));
      })

    });
  }

  // functions =================
  createGroup(groupName: any, mentorEmail: any) {
    this.groupservice.createGroup(groupName, mentorEmail).subscribe({
      next: (result) => {
        this.userservice.retrieveUserByEmail(mentorEmail).subscribe({
          next: (user) => {
            this.userservice.addRoleToUser(user.uid, Roles[2]).subscribe()
          }
        })
        this.retrieveGroups()
      }
    })
  }

  retrieveGroups() {
    this.groups = []
    this.groupservice.retrieveGroups().subscribe({
      next: (result) => {
        this.groups = Object.values(result)
        this.groups.forEach((group: Group) => {
          this.retrieveGroupsForm.addControl(group.groupName, new FormControl(group.groupName));
        });
      }
    })
  }

  updateGroup() {
    this.groupservice.updateGroup(this.updateGroupForm.value).subscribe({
      next: (result) => {
        this.retrieveGroups()
        console.log(result)
      }
    })
  }

  deleteGroup() {
    this.groupservice.deleteGroup(this.updateGroupForm.get('groupId')?.value).subscribe({
      next: (result) => {
        this.retrieveGroups()
      }
    })
  }

  async retrieveSingleUser(email: any) {
    await this.userservice.retrieveUserByEmail(email).subscribe(({
      next: (user) => {
        console.log(user)
        this.participantemail_.nativeElement.innerText = user.email
        this.participantid_.nativeElement.innerText = user.uid
      }
    }))

  }

  addUserToGroup(uid: any) {
    this.userservice.addParticipantToGroup(this.updateGroupForm.get('groupId')?.value, uid, Roles[3]).subscribe({
      next: (result) => {
        console.log(result)
      }
    })
  }
}
