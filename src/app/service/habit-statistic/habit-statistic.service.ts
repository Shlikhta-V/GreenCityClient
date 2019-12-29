import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { HabitDto } from '../../model/habit/HabitDto';
import { NewHabitDto } from '../../model/habit/NewHabitDto';
import { habitStatisticLink, userLink } from '../../links';

import { LocalStorageService } from '../localstorage/local-storage.service';
import { HabitStatisticsDto } from '../../model/habit/HabitStatisticsDto';
import { habitLink, mainLink } from 'src/app/links';
import { HabitStatisticLogDto } from 'src/app/model/habit/HabitStatisticLogDto';
import { AvailableHabitDto } from 'src/app/model/habit/AvailableHabitDto';
import { OnLogout } from '../OnLogout';

@Injectable({
  providedIn: 'root'
})
export class HabitStatisticService implements OnLogout {
  private userId: number;
  private $habitStatistics = new BehaviorSubject<HabitDto[]>([]);
  private $availableHabits = new BehaviorSubject<AvailableHabitDto[]>([]);
  private dataStore:
    {
      habitStatistics: HabitDto[],
      availableHabits: AvailableHabitDto[],
      newHabits: NewHabitDto[]
    } =
    {
      habitStatistics: [],
      availableHabits: [],
      newHabits: []
    };
  readonly habitStatistics = this.$habitStatistics.asObservable();
  readonly availableHabits = this.$availableHabits.asObservable();

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    localStorageService.userIdBehaviourSubject.subscribe(userId => this.userId = userId);
  }

  loadHabitStatistics() {
    this.http.get<HabitDto[]>(`${userLink}/${this.userId}/habits`).subscribe(data => {
      this.dataStore.habitStatistics = data;
      this.$habitStatistics.next(Object.assign({}, this.dataStore).habitStatistics);
    }, () => console.log('Can not load habit statistic.'));
  }

  loadAvailableHabits() {
    this.http.get<AvailableHabitDto[]>(`${userLink}/${this.userId}/habit-dictionary/available`).subscribe(data => {
      this.dataStore.availableHabits = data;
      this.$availableHabits.next(Object.assign({}, this.dataStore).availableHabits);
    }, () => console.log('Can not load available habits.'));
  }

  setNewHabitsState(args) {
    if (this.dataStore.newHabits.find(nh => nh.habitDictionaryId === args.id)) {
      this.dataStore.newHabits = this.dataStore.newHabits.filter(nh => nh.habitDictionaryId !== args.id);
    } else {
      this.dataStore.newHabits = [...this.dataStore.newHabits, new NewHabitDto(args.id)];
    }
  }

  createHabits() {
    this.http.post<any>(`${userLink}/${this.userId}/habit`, this.dataStore.newHabits).subscribe(() => {
      this.dataStore.newHabits = [];
      this.loadAvailableHabits();
      this.loadHabitStatistics();
    }, () => console.log('Can not assign new habit for this user'));
  }

  deleteHabit(habitId: number) {
    this.http.delete<any>(`${userLink}/${this.userId}/habit/${habitId}`).subscribe(() => {
      this.loadAvailableHabits();
      this.loadHabitStatistics();
    }, () => console.log('Can not remove habit for this user'));
  }

  updateHabitStatistic(habitStatisticDto: HabitStatisticsDto) {
    this.http.patch<HabitStatisticsDto>(`${habitStatisticLink}${habitStatisticDto.id}`, habitStatisticDto).subscribe(data => {
      let index: number;

      this.dataStore.habitStatistics.forEach((item, i) => {
        index = item.habitStatistics.findIndex(stat => stat.id === data.id);
        if (index !== -1) {
          this.dataStore.habitStatistics[i].habitStatistics[index] =
            new HabitStatisticsDto(data.id, data.habitRate, data.createdOn, data.amountOfItems, data.habitId);

          this.$habitStatistics.next(Object.assign({}, this.dataStore).habitStatistics);
        }
      });
    }, () => console.log('Can not update habit statistic'));
  }

  createHabitStatistic(habitStatistics: HabitStatisticsDto) {
    this.http.post<HabitStatisticsDto>(`${habitStatisticLink}`, habitStatistics).subscribe(data => {
      this.dataStore.habitStatistics.forEach((habit, habitIndex) => {
        if (habit.id === habitStatistics.habitId) {
          habit.habitStatistics.forEach((stat, statIndex) => {
            if (stat.createdOn === habitStatistics.createdOn) {
              this.dataStore.habitStatistics[habitIndex].habitStatistics[statIndex] =
                new HabitStatisticsDto(data.id, data.habitRate, data.createdOn, data.amountOfItems, data.habitId);
              this.$habitStatistics.next(Object.assign({}, this.dataStore).habitStatistics);
              return;
            }
          });
        }
      });
    }, () => console.log('Can not create habit statistic'));
  }

  getUserLog(): Observable<any> {
    return this.http.get<HabitStatisticLogDto>(`${mainLink + 'user/' + this.userId + habitLink}`);
  }

  getNumberOfHabits(): number {
    return this.dataStore.habitStatistics.length;
  }

  clearDataStore(): void {
    this.dataStore.newHabits = [];
    this.loadAvailableHabits();
    this.loadHabitStatistics();
  }

  onLogout(): void {
    this.dataStore.newHabits = [];
    this.dataStore.availableHabits = [];
    this.dataStore.habitStatistics = [];
    this.$habitStatistics.next(Object.assign({}, this.dataStore).habitStatistics);
    this.$availableHabits.next(Object.assign({}, this.dataStore).availableHabits);
  }
}