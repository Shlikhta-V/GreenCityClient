import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FriendModel } from '@global-user/models/friend.model';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  private url: string = environment.backendLink;

  constructor(private http: HttpClient) { }

  public getRecommendedFriends(id: number): Observable<FriendModel[]> {
    return this.http.get<FriendModel[]>(`${this.url}`);
  }

  public getFriends(userId: number): Observable<FriendModel[]> {
    return this.http.get<FriendModel[]>(`${this.url}/user/${userId}/sixUserFriends`);
  }

  public addFriend(idUser: number | string, idFriend: number | string): Observable<object> {
    const body = {
      friendId: idFriend,
      userId: idUser
    };

    return this.http.post<object>(`${this.url}/user/${idUser}/userFriend/${idFriend}`, body);
  }

  public deleteFriends(idUser: number, idFriend: number ): Observable<object> {
    const body = {
      friendId: idFriend,
      userId: idUser
    };
    return this.http.get<object>(`${this.url}/user/${idUser}/sixUserFriends`);
  }
}