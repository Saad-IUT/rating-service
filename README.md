Product Service

_baseUrl_: &#39;[https://product-service-sda.herokuapp.com](https://product-service-sda.herokuapp.com/)&#39;

**POST** : Add a product (Endpoint: /product/add)

Sample body: {

&quot;name&quot;: &quot;balloon&quot;,

&quot;categoryId&quot;: 2

}

**All products list:**

To get the list of all products: **GET:**&#39;[https://product-service-sda.herokuapp.com/product/list](https://product-service-sda.herokuapp.com/product/list)&#39;

**DELETE** : Remove product (Endpoint: /product/remove/\&lt;id\&gt;)

Here in place of \&lt;id\&gt; use an id from **all products list**.

**GET** : Fetch the list of products (Endpoint: /product/list)

**POST** : Change the category of a product. (Endpoint: /product/updateCategory)

Sample body: {

&quot;productId&quot;: &quot;6EBijQ9vQgv3BkpQ07dL&quot;,

&quot;categoryId&quot;: &quot;4&quot;

}

Rating Service

_baseUrl_: &#39;[https://rating-service-sda.herokuapp.com](https://rating-service-sda.herokuapp.com/)&#39;

**POST** : Rate a product (Endpoint: /rate)

Sample body: {

&quot;productId&quot;: &quot;6EBijQ9vQgv3BkpQ07dL&quot;,

&quot;rating&quot;: 3,

&quot;raterId&quot;: &quot;3&quot;

}

If you use the same _productId_ and _raterId_ then the rating is only updated.

Lastly, after every 5 new ratings added the ProductService is synced with it.
