import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { User } from '../_models/user';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({ templateUrl: 'home-page.component.html' })
export class HomePageComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    users: User[] = [];
    message;
    lastId = 0;

    constructor(
        private authenticationService: AuthService,
        private userService: UserService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });

        // tslint:disable-next-line:prefer-const
        this.message = this.getMessage();

        if (this.message.length === 0) {
            this.lastId = 0;
        } else {
            // tslint:disable-next-line:prefer-const
            let maxId = this.message[this.message.length - 1].id;
            this.lastId = maxId + 1;
        }
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    getMessage() {
        // tslint:disable-next-line:prefer-const
        let localStorageItem = JSON.parse(localStorage.getItem('messages'));
        return localStorageItem == null ? [] : localStorageItem.messages;
    }

    setLocalStorageMessages(messages: []): void {
        localStorage.setItem('messages', JSON.stringify({messages}));
    }

    delete(id) {
        this.message = this.getMessage();
        this.message = this.message.filter( t => t.id !== id );
        this.setLocalStorageMessages(this.message);
    }

    add(mes) {
        const newMes = {
            list: mes,
            id: this.lastId
        };
        // tslint:disable-next-line:prefer-const
        this.message = this.getMessage();
        this.message.push(newMes);

        this.setLocalStorageMessages(this.message);
        this.lastId++;
    }

    ngOnDestroy() {
        this.currentUserSubscription.unsubscribe();
    }

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }
}
