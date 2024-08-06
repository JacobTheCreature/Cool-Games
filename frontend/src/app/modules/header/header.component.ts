import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { Game } from '../../game';
import { GameService } from '../../services/game.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from '../../modules/dashboard/dashboard.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DropdownComponent, FormsModule, NgIf, RouterModule, DashboardComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  @ViewChild(DropdownComponent) dropdownComponent!: DropdownComponent;

  constructor (
    public gameService: GameService
  ) {}

  selectedGame: Game | undefined;
  games: Game[] = [];
  newGame: Game = { id: 0, title: '', url: '', image: ''};
  gameLabel: string = '';
  gameUrl: string | undefined;
  gameImg: string = '';
  tempTitle: string = '';
  tempUrl: string = '';
  tempImg: string = '';
  searchInput: string = '';

  onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.gameService.updateSearchQuery(inputElement.value);
  }

  createGame(): void {
    this.newGame.title = this.tempTitle;
    this.newGame.url = this.tempUrl;
    this.newGame.image = this.tempImg;
    console.log(this.newGame.image);
    this.gameService.createGame(this.newGame).subscribe((createdGame) => {
      console.log('Game created successfully:', createdGame);
      this.newGame = { id: 0, title: '', url: '', image: ''};
      this.tempTitle = '';
      this.tempUrl = '';
      this.tempImg = '';
      this.gameService.emitGameUpdate(); 
    }, error => {
      console.error('Error creating game:', error);
    });
  }

  updateGame(): void {
    if (this.selectedGame) {
      this.selectedGame.title = this.gameLabel;
      this.selectedGame.url = this.gameUrl;
      this.selectedGame.image = this.gameImg;
      this.gameService.updateGame(this.selectedGame).subscribe(() => {
        console.log('Game updated successfully!');
        this.gameService.emitGameUpdate(); 
      }, error => {
        console.error('Error updating game:', error);
      });
    }
  }

  deleteGame(): void {
    if (this.selectedGame) {
      this.gameService.selectedGame = undefined;
      this.gameService.deleteGame(this.selectedGame.id).subscribe(() => {
        console.log('Game deleted successfully!');
        this.gameService.emitGameUpdate(); 
      }, error => {
        console.error('Error delete game:', error);
      });
    }
  }

  editCancel(): void {
    if (this.selectedGame) {
      this.gameLabel = this.selectedGame.title;
      this.gameUrl = this.selectedGame.url;
      this.gameImg = this.selectedGame.image;
    }
  }

  onGameSelected(): void {
    this.gameService.emitGameChange();
  }

  unselectGame(): void {
    this.gameService.selectedGame = undefined;
  }

  gameChangeSelect() {
    this.selectedGame = this.gameService.selectedGame;
    this.gameLabel = this.selectedGame!.title;
    this.gameUrl = this.selectedGame?.url;
    this.gameImg = this.selectedGame!.image;
  }

  ngOnInit(): void {
    this.gameService.getGames().subscribe(games => {
      this.games = games;
    });
    this.gameService.gameChange$.subscribe(() => {
      this.gameChangeSelect();
    });
  }

}
