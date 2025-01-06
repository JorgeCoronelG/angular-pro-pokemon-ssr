import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PokemonListComponent } from "../../pokemons/components/pokemon-list/pokemon-list.component";
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { SimplePokemon } from '../../pokemons/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { PokemonListSkeletonComponent } from './ui/pokemon-list-skeleton/pokemon-list-skeleton.component';

@Component({
  selector: 'app-pokemons-page',
  standalone: true,
  imports: [
    PokemonListComponent,
    PokemonListSkeletonComponent
],
  templateUrl: './pokemons-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);
  private pokemonsService = inject(PokemonsService);

  pokemons = signal<SimplePokemon[]>([]);
  currentPage = toSignal<number>(
    this.route.queryParamMap.pipe(
      map(params => params.get('page') ?? '1'),
      map(page => (isNaN(+page)) ? 1 : +page),
      map(page => Math.max(1, page))
    )
  );

  /*private appRef = inject(ApplicationRef);
  private appState$ = this.appRef.isStable.subscribe(res => {
    console.log(res);
  });

  isLoading = signal(true);

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 5000);
  }

  ngOnDestroy(): void {
    console.log('destroy');
    this.appState$.unsubscribe();
  }*/

  ngOnInit(): void {

    this.loadPokemons();
  }

  loadPokemons(page: number = 0) {
    const pageToLoad = this.currentPage()! + page;

    this.pokemonsService.loadPage(pageToLoad).pipe(
      tap(() => { this.router.navigate([], { queryParams: { page: pageToLoad } }) }),
      tap(() => this.title.setTitle(`Pokémons SSR - Page ${pageToLoad}`)),
    ).subscribe(pokemons => {
      this.pokemons.set(pokemons);
    });
  }
}
