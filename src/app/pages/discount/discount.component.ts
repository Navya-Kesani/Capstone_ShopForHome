import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

import {Subscription} from "rxjs";
import { Discount } from 'src/app/models/discount';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent implements OnInit,OnDestroy {

  constructor(private route:ActivatedRoute,
    private orderService : OrderService,
    private router: Router) { }

    page: any; 
    querySub: Subscription;
    discountDetail : Discount;
    coupon : any;


  ngOnInit() {
    this.querySub = this.route.queryParams.subscribe(() => {
      this.getCouponList();
    //this.userService.getPage().subscribe(response => this.page= response);
    console.log(this.page);
  });
  }

            


  getCouponList(){
    let nextPage=1;
    let size = 10;
    if(this.route.snapshot.queryParamMap.get('page')){
      nextPage =+ this.route.snapshot.queryParamMap.get('page');
      size =+ this.route.snapshot.queryParamMap.get('size');
    }
    this.orderService.getCouponPage(nextPage,size).subscribe(page => this.page = page, _ =>{
      console.log("Get User Failed")
    });

  }


  addCoupon(code:string){
    console.log("addCoupon")
    this.orderService.addCoupon(code).subscribe(response => this.getCouponList());
    //this.getCouponList();
  }

  deleteCoupon(code:string){
    this.orderService.deleteCoupon(code).subscribe(response => this.getCouponList());
  }

  ngOnDestroy(): void {
  }


}
