import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { SixFriendArrayModel } from '@global-user/models/friend.model';

@Component({
  selector: 'app-users-friends',
  templateUrl: './users-friends.component.html',
  styleUrls: ['./users-friends.component.scss']
})
export class UsersFriendsComponent implements OnInit {
  public usersFriends;
  public noFriends = null;
  public userId: number;
  public amountOfFriends: number;

  constructor(private profileService: ProfileService,
              private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.showUsersFriends();
    this.initUser();
  }

  public showUsersFriends(): void {
    this.profileService.getUserFriends()
      .subscribe((item: SixFriendArrayModel) => {
        this.usersFriends = item.pagedFriends.page;
        this.amountOfFriends = item.amountOfFriends;
      }, error => {
        this.noFriends = error;
      });
  }

  public initUser(): void {
    this.localStorageService.userIdBehaviourSubject
      .subscribe((userId: number) => this.userId = userId);
  }
}


