import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { PokemonListComponent } from "../../pokemons/components/pokemon-list/pokemon-list.component";
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { SimplePokemon } from '../../pokemons/interfaces';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';

@Component({
  selector: 'app-pokemons-page',
  standalone: true,
  imports: [
    PokemonListComponent,
    PokemonListSkeletonComponent,
    RouterLink,
],
  templateUrl: './pokemons-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent {
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  private pokemonsService = inject(PokemonsService);

  pokemons = signal<SimplePokemon[]>([]);
  currentPage = toSignal<number>(
    this.route.params.pipe(
      map(params => params['page'] ?? '1'),
      map(page => (isNaN(+page)) ? 1 : +page),
      map(page => Math.max(1, page))
    )
  );

  loadOnPageChanged = effect(() => {
    this.loadPokemons(this.currentPage());
  }, {
    allowSignalWrites: true
  });

  loadPokemons(page: number = 0) {
    this.pokemonsService.loadPage(page).pipe(
      tap(() => this.title.setTitle(`Pokémons SSR - Page ${page}`)),
    ).subscribe(pokemons => {
      this.pokemons.set(pokemons);
    });
  }
}
