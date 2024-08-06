import { Component, Input, OnInit } from '@angular/core';
import { Game } from '../../game';
import { GameService } from '../../services/game.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gameframe',
  standalone: true,
  imports: [NgIf],
  templateUrl: './gameframe.component.html',
  styleUrl: './gameframe.component.css'
})
export class GameframeComponent implements OnInit {
  

  constructor (
    public gameService: GameService,
    private route: ActivatedRoute
  ) {}
  

  ngOnInit(): void {
    // Using snapshot
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : 0;

    this.gameService.getGame(id).subscribe(game => {
      this.gameService.setSelectedGame(game);
      this.gameService.emitGameChange();
    })
  }
}