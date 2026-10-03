export interface createOrderRequest {
    shippingAddress:string
}

export interface ProductsOrderList {
    id:number,
    items:OrderItems[]
    orderDate:string,
    shippingAddress:string,
    status:string,
    totalAmount:number,
    userId:number
}

export interface OrderItems {
    id:number,
    priceAtPurchase:number,
    productBrand:string,
    productModel:string,
    productTitle:string,
    quantity:number,
    subTotal:number
}

export interface UpdateOrderStatusRequest {
    status : 'CONFIRMED' | 'SHIPPED' | 'CANCELLED' | 'PENDING' | 'DELIVERED'
}
