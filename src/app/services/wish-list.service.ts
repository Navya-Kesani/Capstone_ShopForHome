import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {apiUrl} from '../../environments/environment';
import {Cart} from '../models/Cart';
import {Item} from '../models/Item';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {JwtResponse} from '../response/JwtResponse';
import {UserService} from './user.service';
import {CookieService} from 'ngx-cookie-service';
import {ProductInfoMain} from '../models/product-info-main';
import {ProductService} from '../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, map, tap} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import { WishList } from '../models/wish-list';
import { ProductInfo } from '../models/productInfo';




@Injectable({
  providedIn: 'root'
})
export class WishListService {

  private wishListUrl = `${apiUrl}/wishlist`;
  private productUrl = `${apiUrl}/product`;

  localWishlist = {};

  private itemsSubject: BehaviorSubject<Item[]>;
    private totalSubject: BehaviorSubject<number>;
    public items: Observable<Item[]>;
    public total: Observable<number>;

    private updateTerms = new Subject<ProductInfoMain>();
    sub: Subscription;

  

  private currentUser: JwtResponse;
  productId: string;
  private productInfo: ProductInfoMain;
  product = new ProductInfoMain();

  constructor(private http: HttpClient,
    private cookieService: CookieService,
    private userService: UserService,
    private route: ActivatedRoute,
    private productService :ProductService) {
      this.itemsSubject = new BehaviorSubject<Item[]>(null);
      this.items = this.itemsSubject.asObservable();
      this.totalSubject = new BehaviorSubject<number>(null);
      this.total = this.totalSubject.asObservable();
      this.userService.currentUser.subscribe(user => this.currentUser = user);
    }

    getDetail(id: String): Observable<ProductInfoMain> {
      const url = `${this.productUrl}/${id}`;
      return this.http.get<ProductInfoMain>(url).pipe(
          catchError(_ => {
              console.log("Get Detail Failed");
              return of(new ProductInfoMain());
          })
      );
  }

    private getLocalWishList(productId): ProductInfoMain {
      console.log(productId);
      console.log(this.productService.getDetail(productId));
      this.getDetail(productId).subscribe(product => this.product = product);
      return this.product;
    }

  getPage(page = 1, size = 10): Observable<any> {
      return this.http.get(`${this.wishListUrl}/list?page=${page}&size=${size}`).pipe();
  }

  addToWishList(productId): Observable<boolean>{
    console.log("started service");
   // const localWishlist = this.getLocalWishList(productId);
    
    console.log(productId);
    const url=this.wishListUrl + '/add';
    if (this.currentUser) {
      console.log("if1");
      if (productId) {
        console.log("if2");
        console.log(url);
           this.http.post<WishList>(url, productId);
              
          return of(true);
      } else {
          // this.http.get<WishList>(this.wishListUrl);
          return of(false);
      }
  } 
  }

  removeFromWishList(productId:string): Observable<Boolean>{
    const url=this.wishListUrl + '/delete/'+productId;
    if(this.currentUser){
     return this.http.post<Boolean>(url,null);
      //  return of(true);

    }else{
      return of(false);
    }
  }


  storeLocalWishList() {
    this.cookieService.set('wishlist', JSON.stringify(this.localWishlist));
}

clearLocalWishList() {
    console.log('clear local cart');
    this.cookieService.delete('wishlist');
    this.localWishlist = {};
}

}
