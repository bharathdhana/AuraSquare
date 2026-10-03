import { ChangeDetectorRef, Component, computed, inject, NgZone, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CartProduct } from '../../models/cart.model';
import { OrderService } from '../../services/order.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  imports: [NavbarComponent, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class CheckoutComponent implements OnInit{
  
  checkOutForm!: FormGroup;
  private formBuilder = inject(FormBuilder)
  private cartService = inject(CartService)
  private cdr = inject(ChangeDetectorRef)
  private orderService = inject(OrderService)
  private ngZone = inject(NgZone)
  private router = inject(Router)

  readonly isLoading = signal<boolean>(false)
  readonly cartList = signal<CartProduct | null>(null);
  readonly isPlacingOrder = signal<boolean>(false)
  readonly orderError = signal<string>('')

  readonly totalCartAmount = computed(() => {
    const cart = this.cartList()
    const items = cart?.items ?? []
    return items.reduce((sum, item) => sum + (item.productPrice || 0) * (item.quantity || 0), 0)
  });

  ngOnInit(): void {
    this.initForm()
    this.loadCart()
  }

  initForm():void {
    this.checkOutForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email, Validators.required]],
      phone: ['' , Validators.required],
      addressLine: ['', Validators.required],
      city : ['' , Validators.required],
      state: ['', Validators.required],
      pinCode: ['', Validators.required]
    })
  }

  onSubmitForm() {
    if(this.checkOutForm.invalid) {
      this.checkOutForm.markAllAsTouched()
      return
    }

    if (this.totalCartAmount() <= 0) {
      this.orderError.set('Your cart is empty. Please add items before checking out.');
      return;
    }

    this.initiatePayment()
  }

  get formControl() {
    return this.checkOutForm.controls
  }

  loadCart() {
    this.isLoading.set(true)
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cartList.set(cart)
        this.isLoading.set(false)
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false)
        this.cdr.detectChanges()
      }
    })
  }

  initiatePayment() {
    this.orderError.set('')

    if (!environment.razorpayKeyId) {
      this.orderError.set('Razorpay test mode is not configured. Add the test key ID in the environment configuration.')
      return
    }

    if (typeof Razorpay === 'undefined') {
      this.orderError.set('Razorpay failed to load. Please check your internet connection and try again.')
      return
    }

    const totalAmountPaise = Math.round(this.totalCartAmount() * 100)
    const formValue = this.checkOutForm.value

    const options = {
      key: environment.razorpayKeyId,
      amount: totalAmountPaise,
      currency: 'INR',
      name: 'AuraSquare',
      description: 'Order Payment',
      image: 'http://via.placeholder.com/150',
      handler: (response: any) => {
        this.ngZone.run(() => {
          this.placeOrder(response.razorpay_payment_id);
        });
      },
      prefill: {
        name: formValue.fullName,
        email: formValue.email,
        contact: formValue.phone,
      },
      notes: {
        address: this.getAddress()
      },
      theme: {
        color: '#4F46E5'
      },
      modal: {
        ondismiss: () => {
          this.ngZone.run(() => {
            this.isPlacingOrder.set(false);
            this.cdr.detectChanges();
          });
        }
      }
    }

    try {
      this.isPlacingOrder.set(true);
      const razorPay = new Razorpay(options)
      razorPay.on('payment.failed', (response: any) => {
        this.ngZone.run(() => {
          this.isPlacingOrder.set(false);
          this.orderError.set(response?.error?.description || 'Payment Failed');
          this.cdr.detectChanges();
        });
      })
      razorPay.open()
    }
    catch (err) {
      this.isPlacingOrder.set(false);
      this.orderError.set('Razorpay failed to load, Please try again later!');
    }
  }

  getAddress() {
    const formValue = this.checkOutForm.value
    return `${formValue.addressLine}, ${formValue.city}, ${formValue.state}, ${formValue.pinCode}`
  }

  placeOrder(paymentId: string): void {
    this.isPlacingOrder.set(true)
    const shippingAddress = this.getAddress()
    this.orderService.createOrder({ shippingAddress }).subscribe({
      next: (order) => {
        this.sendConfirmationEmail(order, paymentId);
        this.isPlacingOrder.set(false);
        this.cartService.getCart().subscribe();
        this.router.navigate(['/order-confirmation'],
          { queryParams: { orderSuccess: 'true' },
            state: {
              order, paymentId, email: this.checkOutForm.value.email
            } },
        );
      },
      error: (err) => {
        this.orderError.set(err?.error?.message || 'Failed to place Order');
        this.isPlacingOrder.set(false);
        this.cdr.detectChanges();
      }
    })
  }

  sendConfirmationEmail(order: any, paymentId: string) {
    const emailjs = (window as any).emailjs;
    if (!emailjs) {
      console.error('EmailJS SDK is not loaded on window.');
      return;
    }

    const formValue = this.checkOutForm.value;
    const templateParams = {
      to_name: formValue.fullName,
      user_name: formValue.fullName,
      name: formValue.fullName,
      to_email: formValue.email,
      user_email: formValue.email,
      email: formValue.email,
      reply_to: formValue.email,
      order_id: order?.id || order?.orderId || 'Not Available',
      payment_id: paymentId,
      shippingAddress: this.getAddress(),
      shipping_address: this.getAddress(),
      totalAmount: this.totalCartAmount(),
      amount: this.totalCartAmount(),
      order_date: new Date().toLocaleString()
    };

    emailjs.send(
      'service_k5y24gr',
      'template_9u0pl4e',
      templateParams,
      { publicKey: 'k_q7xVv7JPivbqwwz' }
    ).then((response: any) => {
      console.log('Confirmation email sent successfully:', response.status, response.text);
    }).catch((err: any) => {
      console.error('Failed to send confirmation email. Status:', err?.status, 'Error text:', err?.text || err);
    });
  }
}

