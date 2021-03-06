import { Component, OnDestroy, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { textChangeRangeIsUnchanged } from 'typescript';
import { Quest } from '../Models/quest';
import { QuestService } from '../Services/quest.service';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.css']
})
export class QuestsComponent implements OnInit, OnDestroy {

  //Fields
  public quests: Quest[] = [];
  public greeting: String = '';
  private subscription: Subscription = new Subscription();

  constructor(private questService: QuestService,
    private cookies: CookieService) { }

  ngOnInit(): void {
    this.getQuests() 
    this.getGreeting();
    
  }

  //Getting all quests from API and caching to observable
  public getQuests(): void {
      this.subscription.add(this.questService.getQuests()
      .subscribe(quest => this.quests = quest))     
  }

  //Simple greeting based on your time of day
  public getGreeting(): void{
    
    var today = new Date()
    var curHr = today.getHours()

    if (curHr < 12) {
      this.greeting = 'Good morning ';
    } else if (curHr < 18) {
      this.greeting = 'Good afternoon ';
    } else {
      this.greeting = 'Good evening ';
    }
    this.greeting += JSON.parse(this.cookies.get("user")).username
  }

    public completeQuest(subquestId: number): void {
      
      let userId = JSON.parse(this.cookies.get("user")).id

      this.questService.completeQuest(userId.toString(), subquestId.toString())
        .subscribe(response =>{
          console.log(response);
        })

      var subQuest;
      this.quests.forEach(quest => {
        if (subQuest = quest.subQuests.find(subQuest => subQuest.id == subquestId)){
          subQuest.completed = true;
          return;
        }
      })

    }

  //Unsubscribe from all made subscriptions to prevent background processes and possible memory leakage.
  ngOnDestroy()
  {
    this.subscription.unsubscribe();
  }
}
