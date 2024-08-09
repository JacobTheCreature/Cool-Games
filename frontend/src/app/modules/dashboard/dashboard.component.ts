import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { GameService } from '../../services/game.service'
import { Game } from '../../game'
import { CommonModule, NgFor } from '@angular/common'
import { Router } from '@angular/router'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  games: Game[] = []
  filteredList: Game[] = []
  searchInput: string = ''

  get defaultImage() {return this.gameService.defaultImage}

  constructor (
    private gameService: GameService,
    private router: Router
  ) {}

  getGames(): void {
    this.gameService.getGames()
      .subscribe(games => {
        this.games = games
        this.filteredList = games
      })
  }

  updateDashboard(): void {
    this.gameService.getGames().subscribe(games => {
      this.games = games
      this.filteredList = games
    })
  }

  filter(query: string): void {
    const lowerCaseQuery = query.toLowerCase()
    this.filteredList = this.games.filter(game =>
      game.title.toLowerCase().includes(lowerCaseQuery)
    )
  }

  onSelect(game: Game): void {
    this.gameService.setSelectedGame(game)
    this.gameService.emitGameChange()
    this.router.navigate([`/game-frame/${game.id}`])
  }

  isTitleLong(title: string): boolean {
    return title.length > 20
  }

  ngOnInit(): void {
    this.gameService.getGames().subscribe(games => {
      this.games = games
      this.filteredList = games
    })
    this.gameService.gameUpdate$.subscribe(() => {
      this.updateDashboard()
    })
    this.gameService.currentSearchQuery.subscribe(query => {
      this.filter(query)
    })
  }
}
