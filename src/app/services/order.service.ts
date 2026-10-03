import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { createOrderRequest, ProductsOrderList, UpdateOrderStatusRequest } from "../models/order.model";

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/order`;

    readonly orderState = signal<OrderService | null>(null)

    createOrder(request:createOrderRequest):Observable<any> {
        return this.http.post<createOrderRequest>(this.apiUrl, request)
    }

    getOrders(): Observable<ProductsOrderList[]> {
        return this.http.get<ProductsOrderList[]>(`${this.apiUrl}/orders`)
    }

    updateOrderStatus(orderId: number, request: UpdateOrderStatusRequest): Observable<any> {
        return this.http.put(`${this.apiUrl}/${orderId}/status`, request)
    }
}
