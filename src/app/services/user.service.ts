import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/user`;

    getUsers(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/users`);
    }

    deleteUser(id: number): Observable<string> {
        return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' as const });
    }
}
