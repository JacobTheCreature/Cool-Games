import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { GAMES } from '../../mock-games'
import { NgFor, NgIf } from '@angular/common'
import { Game } from '../../game'
import { GameService } from '../../services/game.service'
import { FormsModule } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [NgFor,
    NgIf,
    FormsModule,
    RouterModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  @Output() gameSelected = new EventEmitter<Game>()

  constructor (
    private gameService: GameService, 
    private router: Router
  ) {}

  searchInput: string = ''
  games: Game[] = []
  filteredList: Game[] | undefined

  getGames(): void {
    this.gameService.getGames()
      .subscribe(games => this.games = games)
  }

  onSelect(game: Game) {
    this.gameService.getGame(game.id).subscribe(selectedGame => {
      this.gameService.setSelectedGame(selectedGame)
      this.gameSelected.emit(selectedGame)
      this.gameService.emitGameChange()
      this.router.navigate([`/game-frame/${game.id}`])
    })
  }

  updateDropdown(): void {
    this.gameService.getGames().subscribe(games => {
      this.games = games
      this.filteredList = games
    })
  }

  filter(): void {
    const query = this.searchInput.toLowerCase()
    this.filteredList = this.games.filter(game =>
      game.title.toLowerCase().includes(query)
    )
  }
  
  ngOnInit(): void {
    this.gameService.getGames().subscribe(games => {
      this.games = games
      this.filteredList = games
      this.gameService.gameUpdate$.subscribe(() => {
        this.updateDropdown()
      })
    })
  }
}
