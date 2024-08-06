import { Injectable } from '@angular/core';
import { Game } from '../game';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const options = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameChange = new Subject<void>();
  private gameUpdateSubject = new Subject<void>();

  gameChange$ = this.gameChange.asObservable();
  gameUpdate$ = this.gameUpdateSubject.asObservable();

  emitGameUpdate(): void {
    this.gameUpdateSubject.next();
  }

  private searchQuery = new BehaviorSubject<string>('');
  currentSearchQuery = this.searchQuery.asObservable();

  updateSearchQuery(query: string) {
    this.searchQuery.next(query);
  }

  emitGameChange(): void {
    this.gameChange.next();
  }

  selectedGame: Game | undefined;
  safeSelectedGameUrl: SafeResourceUrl | undefined;

  constructor (
    private _http: HttpClient,
    private sanitizer: DomSanitizer,
  ) { }

  getSanitizedUrl(url: string | undefined): SafeResourceUrl | undefined {
    console.log("GameFrameComponent reloading src");
    if (url && this.isValidUrl(url)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      console.error('Invalid URL:', url);
      return undefined;
    }
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  getGames(): Observable<Game[]> {
    const url = `http://localhost:3000/games`;
    return this._http.get<Game[]>(url);
  }

  getGame(gameID: number): Observable<Game> {
    const url = `http://localhost:3000/game/${gameID}`;
    return this._http.get<Game>(url).pipe(
      tap(game => {
        this.selectedGame = game})
    );
  }

  setSelectedGame(game: Game): void {
    this.selectedGame = game;
    this.safeSelectedGameUrl = this.getSanitizedUrl(this.selectedGame.url);
  }

   createGame(game: Game): Observable<Game> {
    console.log(game.image);
     const url = `http://localhost:3000/game/`;
     return this._http.post<Game>(url, game, options);
   }

   deleteGame(gameID: number): Observable<void> {
     const url = `http://localhost:3000/game/${gameID}`;
     return this._http.delete<void>(url, options);
  }

   updateGame(game: Game): Observable<void> {
    console.log(game.image, "inside gameservice image");
    console.log(game.title, "inside gameservice title");
    const url = `http://localhost:3000/game/${game.id}`;
    return this._http.put<void>(url, game, options);
  }
}
