import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Group } from 'src/models/Group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    private http: HttpClient
  ) { }

  createGroup(groupName: any, mentorEmail: any): Observable<any> {
    const body = { groupName: groupName, mentorEmail: mentorEmail };
    return this.http.post(environment.url + '/group/creategroup', body)
  }

  retrieveGroups(): Observable<any> {
    return this.http.get(environment.url + '/group/retrievegroups')
  }

  updateGroup(group: Group): Observable<any> {
    const body = { group: group };
    return this.http.patch(environment.url + '/group/updategroup', body)
  }

  deleteGroup(groupId: any): Observable<any> {
    const body = { groupId: groupId };
    return this.http.delete(environment.url + '/group/deletegroup', { body })
  }
}
