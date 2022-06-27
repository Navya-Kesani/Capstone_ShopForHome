import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {CookieService} from 'ngx-cookie-service';
import {ProductInOrder} from '../../models/ProductInOrder';
import {ProductInfo} from '../../models/productInfo';
import { WishListService } from 'src/app/services/wish-list.service';
import {JwtResponse} from '../../response/JwtResponse';
import {Subscription} from "rxjs";
import {UserService} from '../../services/user.service';




@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  title: string;
  count: number;
  productInfo: ProductInfo;
  addedToWishlist: boolean = false;
  currentUser: JwtResponse;
  userSubscription: Subscription;
  


  constructor(
      private productService: ProductService,
      private cartService: CartService,
      private cookieService: CookieService,
      private route: ActivatedRoute,
      private router: Router,
      private wishListService:WishListService,
      private userService:UserService
  ) {
    this.userSubscription = this.userService.currentUser.subscribe(user => this.currentUser = user);
  }

  ngOnInit() {
    this.getProduct();
    this.title = 'Product Detail';
    this.count = 1;
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //   // Add '${implements OnChanges}' to the class.
  //   console.log(changes);
  //   if (this.item.quantity in changes) {

  //   }
  // }

  getProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getDetail(id).subscribe(
        prod => {
          this.productInfo = prod;
        },
        _ => console.log('Get Cart Failed')
    );
  }

  addToCart() {
    this.cartService
        .addItem(new ProductInOrder(this.productInfo, this.count))
        .subscribe(
            res => {
              if (!res) {
                console.log('Add Cart failed' + res);
                throw new Error();
              }
              this.router.navigateByUrl('/cart');
            },
            _ => console.log('Add Cart Failed')
        );
  }

  validateCount() {
    console.log('Validate');
    const max = this.productInfo.productStock;
    if (this.count > max) {
      this.count = max;
    } else if (this.count < 1) {
      this.count = 1;
    }
  }

  handleAddToWishList( productId){
    console.log("started");
    
    this.cartService.addToWishList(productId).subscribe(() => {
      this.addedToWishlist=true;
    }
    
    );

    console.log(this.addedToWishlist);
  }

  handleRemoveFromWishList( productId){
    this.wishListService.removeFromWishList(productId).subscribe(() => {
      this.addedToWishlist=false;
    }
    
    );
  }




}
