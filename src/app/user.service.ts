import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './_models/user';



@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`app/users`);
    }

    getById(id: number) {
        return this.http.get(`app/users/` + id);
    }

    register(user: User) {
        return this.http.post(`app/users/registration`, user);
    }

    update(user: User) {
        return this.http.put(`app/users/` + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(`app/users/` + id);
    }
}
