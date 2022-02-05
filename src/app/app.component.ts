import { Component, OnInit } from '@angular/core';
import { from, of } from 'rxjs';
import { catchError, map, skip, take, tap } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'rxjs-ex1';

  ngOnInit() {
    // of(2, 4, 6, 8, 5).subscribe(console.log);

    console.log(`Example #2`),
    from([10, 20, 30, 5])
      .pipe(
        tap(item => console.log(`Org: ${item}`)),
        map(item => item * 2),
        map(item => item - 10),
        map(item => {
          if (item === 0) {
            throw new Error(`Zero detected - stream stopped!`)
          }
          return item;
        }),
        take(5)
      ).subscribe(
        item => console.log(`result: ${item}`),
        err => console.error(` ${err}`,
          () => console.log(`completed!`))
      );
      console.log(`Example #3: catchError(this.errorHandler()) eg EMPTY`)
      /**
       * Catch and replace
       *
       * return this.http.get<Product[](this.productsUrl)
       *  .pipe(
       *    catchError(err);
       *    return of ([{id:1, prodName: 'cart'},
       *                {id:2, prodName: 'hammer'}]);
       * });
       */

      /**
       * Catch and Rethrow `throwError(err)`
       * return this.http.get<Product[](this.productsUrl)
       *  .pipe(
       *    catchError(err => {
       *      console.error(err);
       *      return throwError(err);
       * });
       */
  }

}
