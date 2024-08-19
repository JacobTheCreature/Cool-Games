import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { GameService } from '../../services/game.service'
import { Game } from '../../game'
import { CommonModule, NgFor } from '@angular/common'
import { Router } from '@angular/router'
import { CarouselModule } from 'primeng/carousel'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor, CarouselModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  games: Game[] = []
  filteredList: Game[] = []
  searchInput: string = ''

  responsiveOptions: any[] | undefined

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

    this.responsiveOptions = [
      {
          breakpoint: '1199px',
          numVisible: 1,
          numScroll: 1
      },
      {
          breakpoint: '991px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '767px',
          numVisible: 1,
          numScroll: 1
      }
  ]
  
  }
}
