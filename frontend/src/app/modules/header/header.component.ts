import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { Game } from '../../game';
import { GameService } from '../../services/game.service'
import { FormsModule } from '@angular/forms'
import { NgIf } from '@angular/common'
import { RouterModule } from '@angular/router'
import { DashboardComponent } from '../../modules/dashboard/dashboard.component'
import { Subject } from 'rxjs'

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

  public selectedGame: Game | undefined
  public games: Game[] = []
  public newGame: Game = { id: 0, title: '', url: '', image: ''}
  public gameLabel: string = ''
  public gameUrl: string | undefined
  public gameImg: string = ''
  public tempTitle: string = ''
  public tempUrl: string = ''
  public tempImg: string = ''
  public searchInput: string = ''

  public missingUrl: boolean = false
  public missingImg: boolean = false
  public missingTitle: boolean = false

  public invalidUrl: boolean = false
  public invalidImg: boolean = false

  onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement
    this.gameService.updateSearchQuery(inputElement.value)
  }

  submitForm() {
    // Check if the fields are empty
    if (this.tempTitle === '') {
      this.missingTitle = true
    }
    if (this.tempUrl === '') {
      this.missingUrl = true
    }
    if (this.tempImg === '') {
      this.missingImg = true
    }

    if (this.missingTitle || this.missingUrl || this.missingImg ) {
      return
    }
  
    // If the fields are not empty, run the validations
    if (this.tempImg !== '' || this.tempUrl !== '') {
      Promise.all([
        this.tempImg !== '' ? this.isValidImage(this.tempImg) : Promise.resolve(true),
        this.tempUrl !== '' ? this.isValidImage(this.tempUrl) : Promise.resolve(false),
      ]).then(([isValidImg, gameIsImg]) => {
        if (isValidImg && !gameIsImg) {
          this.createGame()
        } else if (!isValidImg && gameIsImg) {
          this.invalidImg = true
          this.invalidUrl = true
        } else if (!isValidImg) {
          this.invalidImg = true
        } else if (gameIsImg) {
          this.invalidUrl = true
        }
      });
    }
  }

  clearAlert(field: string) {
    switch (field) {
      case 'title':
        this.missingTitle = false
        break
      case 'img':
        this.missingImg = false
        this.invalidImg = false
        break
      case 'url':
        this.missingUrl = false
        this.invalidUrl = false
        break
    }  
  }

  createGame(): void {
    this.newGame.title = this.tempTitle
    this.newGame.url = this.tempUrl
    this.newGame.image = this.tempImg
    this.gameService.createGame(this.newGame).subscribe(() => this.gameService.emitGameUpdate())
  }

  resetForm() {
    this.newGame = { id: 0, title: '', url: '', image: '' }
    this.tempTitle = ''
    this.tempUrl = ''
    this.tempImg = ''
    this.missingImg = false
    this.missingTitle = false
    this.missingUrl = false
    this.invalidImg = false
    this.invalidUrl = false
  }

  isValidImage(url: string | undefined): Promise<boolean> {
    return new Promise((resolve) => {
      const img: any = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  }

  updateGame(): void {
    if (this.selectedGame) {
      this.selectedGame.title = this.gameLabel
      this.selectedGame.url = this.gameUrl
      this.selectedGame.image = this.gameImg
      this.gameService.updateGame(this.selectedGame).subscribe(() => this.gameService.emitGameUpdate())
    }
  }

  deleteGame(): void {
    if (this.selectedGame) {
      this.gameService.selectedGame = undefined
      this.gameService.deleteGame(this.selectedGame.id).subscribe(() => this.gameService.emitGameUpdate())
    }
  }

  editCancel(): void {
    if (this.selectedGame) {
      this.gameLabel = this.selectedGame.title
      this.gameUrl = this.selectedGame.url
      this.gameImg = this.selectedGame.image
    }
  }

  onGameSelected(): void {
    this.gameService.emitGameChange()
  }

  unselectGame(): void {
    this.gameService.selectedGame = undefined
  }

  gameChangeSelect() {
    this.selectedGame = this.gameService.selectedGame
    this.gameLabel = this.selectedGame!.title
    this.gameUrl = this.selectedGame?.url
    this.gameImg = this.selectedGame!.image
  }

  ngOnInit(): void {
    this.gameService.getGames().subscribe(games => {
      this.games = games
    })
    this.gameService.gameChange$.subscribe(() => {
      this.gameChangeSelect()
    })
  }

}
