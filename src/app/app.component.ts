import { Component, OnInit } from '@angular/core';
import { stringify } from 'querystring';
import { combineLatest, from, Observable, of } from 'rxjs';
import { catchError, map, skip, take, tap } from 'rxjs/operators';



export class CatagoryData {
  static catergories: Category[] = [
    { id: 1, name: `Food` },
    { id: 2, name: 'Tableware' }
  ];
}

export class ProdApiElementData {
  static prodApiElement: ProdApi =
    {
      total: 40,
      prodList: [
        { id: 10, name: `Apple`, categoryId: 1 },
        { id: 20, name: `Orange`, categoryId: 1 },
        { id: 30, name: `Knife`, categoryId: 2 },
        { id: 40, name: `Fork`, categoryId: 2 }
      ]
    }

}
export class ProdApiData {
  static prodApi: ProdApi[] = [
    {
      total: 40,
      prodList: [
        { id: 10, name: `Apple`, categoryId: 1 },
        { id: 20, name: `Orange`, categoryId: 1 },
        { id: 30, name: `Knife`, categoryId: 2 },
        { id: 40, name: `Fork`, categoryId: 2 }
      ]
    }
  ]
}

export interface ProdApi {
  prodList: Product[],
  total: number,
}

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  category?: string;
}

export interface Category {
  id: number,
  name: string,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'rxjs-ex1';

  // Now place one element of ProdApi into the first position of an observable<ProdApi[]> stream
  prodApiElement$ = of(ProdApiElementData.prodApiElement)
  prodApiArray$ = of([ProdApiElementData.prodApiElement]).pipe(tap(p => console.log(`Array of one ProdApi`, p)));
  // not right
  data$ = of([this.prodApiElement$])
  // #2 Try
  prodApiElement: ProdApi = this.getProdApi();

  prodApi$ = of(ProdApiData.prodApi);
  prodCats$ = of(CatagoryData.catergories);

  // Example #3 Add Category to a ProductApi
  productApiWithProdCats$ = combineLatest([
    this.prodApiArray$, // converted into a one element observable array
    // this.prodApi$,
    this.prodCats$
  ]).pipe(
    map(([productApi, prodCats]) => productApi
      .map(api => api.prodList
        .map(product => ({
          ...product,
          category: prodCats.find(c => product.categoryId === c.id).name,
        }) as Product)
      )
    ),
    tap(console.log)
  )


  getProdApi():ProdApi {
    this.prodApiElement$.subscribe(prod => {
      console.log(`getProdApi()`, prod);
      return this.prodApiElement = prod;
    });
   return this.prodApiElement;
  }

  ngOnInit(): void {
    //Example #3 to transform an objet ProdApi {prod[], total}
    of(this.prodApi$).subscribe(console.log);

    of(this.prodCats$).subscribe(console.log);

    console.log(`getProdApi has returned:`, this.prodApiElement)

    //Example #3A convertion of Observable<ProApi> to Observable<ProApi[]>
    this.getProdApi();
    console.log(`Value Check:`,this.prodApiElement);


    this.productApiWithProdCats$.subscribe(
      data => {
        console.log(`Products (with Categories):`, data[0] as ProdApi);
        // error code
      }
    )

    this.prodApi$.subscribe(
      data => {
        const total = data[0].total;
        console.log(`Total:`, total);
      }
    )

    // of(2, 4, 6, 8, 5).subscribe(console.log);

    /*
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
      console.log(`Example #3: catchError(this.errorHandler()) eg EMPTY`) */
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
