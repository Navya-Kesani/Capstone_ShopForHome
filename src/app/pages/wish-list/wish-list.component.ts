import { Component, OnInit ,OnDestroy,AfterContentChecked} from '@angular/core';
import {CartService} from '../../services/cart.service';
import {Subject, Subscription} from 'rxjs';
import {UserService} from '../../services/user.service';
import {JwtResponse} from '../../response/JwtResponse';
import {ProductInOrder} from '../../models/ProductInOrder';
import {debounceTime, switchMap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {Role} from '../../enum/Role';
import { ProductService } from 'src/app/services/product.service';
import { ProductInfo } from 'src/app/models/productInfo';
import { WishListService } from 'src/app/services/wish-list.service';



@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {

  constructor(private cartService: CartService,
    private userService: UserService,
    private route: ActivatedRoute,            
    private router: Router,
    private productService:ProductService,
    private wishListService: WishListService) {
    this.userSubscription = this.userService.currentUser.subscribe(user => this.currentUser = user);
  }

    productInfo = [];
    total = 0;
    currentUser: JwtResponse;
    userSubscription: Subscription;
    addedToWishlist: boolean = false;
    

  

  page: any;
  productId: string;
  product = new ProductInfo();
    isEdit = false;
    querySub: Subscription;


    ngOnInit() {
       /* this.productId = this.route.snapshot.paramMap.get('id');
         console.log(this.productId);
        if (this.productId) {
            this.isEdit = true;
            this.productService.getDetail(this.productId).subscribe(prod => this.product = prod);
        } */
        this.querySub = this.route.queryParams.subscribe(() => {
          this.update();
      });

    }

    update() {
      let nextPage = 1;
      let size = 10;
      if (this.route.snapshot.queryParamMap.get('page')) {
          nextPage = +this.route.snapshot.queryParamMap.get('page');
          size = +this.route.snapshot.queryParamMap.get('size');
      }
      this.wishListService.getPage(nextPage, size).subscribe(page => this.page = page, _ => {
          console.log("Get Orde Failed")
      });
      console.log(this.page);
  }

  OnDestroy(){
    
  }

  AfterContentChecked(){

  }

  handleRemoveFromWishList( productId : string){
    console.log(productId)
    this.wishListService.removeFromWishList(productId).subscribe(
      success => { this.update();
        
     },
     _ => console.log('Remove Cart Failed'));
    }
    
    
  }


