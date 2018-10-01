/**
 * Topic 2: Object Creation Functions, Inheritance, Properties, Methods, Instantiation
 *
 * @uthor Nick Routsong
 *
 * I chose to go with the Pseudoclassical Instantiation option that allows you to define the objects in a format
 * that I prefer.
 *
 * https://medium.com/dailyjs/instantiation-patterns-in-javascript-8fdcf69e8f9b
 */

/**
 *
 * @constructor
 */
const Order = function() {

    this.orderLineItems  = [];

};

/**
 *
 * @param id
 * @param name
 * @param description
 * @param price
 * @constructor
 */
const Product = function( id, name, description, price ) {

    this.id          = id;
    this.name        = name;
    this.description = description;
    this.price       = price;

};

/**
 *
 * @param product
 * @param quantity
 * @constructor
 */
const OrderLineItem = function( product, quantity ) {

    this.product  = product;
    this.quantity = quantity;

};

/**
 *
 * @param orderLineItem
 * @returns {boolean}
 */
Order.prototype.addOrderLineItem = function( orderLineItem ) {

    const productIndex = this.orderLineItems.findIndex( function( lineItem ) {
        return lineItem.product.id === orderLineItem.product.id;
    });

    if ( productIndex >= 0 ) {

        this.orderLineItems[productIndex].quantity += orderLineItem.quantity;

    } else {

        this.orderLineItems.push( orderLineItem );

    }

    this.drawTable();

    return true;

};

/**
 *
 */
Order.prototype.emptyOrder = function(  ) {
    order.orderLineItems = [];
    order.drawTable();
};

/**
 *
 * @returns {string}
 */
Order.prototype.orderTotal = function() {

    let response = 0.00;

    if ( this.orderLineItems.length > 0 ) {
        this.orderLineItems.forEach( function( item ) {
           response += item.product.price * item.quantity;
        });
    }

    return response.toFixed(2);

};

/**
 *
 */
Order.prototype.drawTable = function() {

    let table = document.getElementById('order');

    let html = '<tbody>';

    if ( this.orderLineItems.length > 0 ) {

        this.orderLineItems.forEach( function( item, index ) {
            html += '<tr>';
            html += '<td>'+ item.product.name +'<span>' + item.product.description + '</span></td>';
            html += '<td>'+ item.quantity +'</td>';
            html += '<td>'+ parseFloat(item.quantity * item.product.price).toFixed(2) +'</td>';
            html += '</tr>';
        } );

        html += '<tr><td></td>';
        html += '<td><strong>Total</strong></td>';
        html += '<td>' + order.orderTotal() + '</td>';

    } else {

        html += '<tr><td>No items currently in order.</td></tr>';

    }

    html += '</tbody>';

    table.innerHTML = html;

};

/**
 *
 * @param products
 */
function populateProductSelector( products ) {

    let productSelector = document.getElementById('productSelector');

    products.forEach( function( product, index ) {
        let opt       = document.createElement('option');
        opt.value     = product.id;
        opt.innerHTML = product.name;
        productSelector.appendChild(opt);
    });

}

/**
 *
 * @type {Order}
 */
let order = new Order();

/**
 *
 * @type {[Product]}
 */
const products = [
    new Product( 1, 'Shoes', 'These are some cool kicks.', 35.80 ),
    new Product( 2, 'Sunglasses', 'Sun and eyes are a bad combo.', 10.50 ),
    new Product( 3, 'T-Shirt', 'Because your arms need to be free.', 8.50 ),
    new Product( 4, 'Shorts', 'Keeping you cool when it is hot out.', 25.30 ),
    new Product( 5, 'Hat', 'When your hair is just not going to work.', 12.50 )
];

/**
 * Populate the select element with the products that have been defined.
 */
populateProductSelector( products );

/**
 * Listen for button click on the Add to Order button. When it is clicked, add it to the Order object and
 * draw the table.
 */
document.getElementById('productAdd').addEventListener('click', function() {
    const selectedProduct = document.getElementById('productSelector');
    const productQuantity = document.getElementById('productQuantity').value;
    order.addOrderLineItem( new OrderLineItem( products[selectedProduct.selectedIndex - 1], parseInt( productQuantity ) ) );
});

/**
 * Listen for button click on the Empty Order button. When it is clicked, we will empty the order's items and
 * draw the table.
 */
document.getElementById('orderEmpty').addEventListener('click', function() {
    if ( confirm( 'Are you sure you want to empty your order?' ) ) {
        order.emptyOrder();
    }
});