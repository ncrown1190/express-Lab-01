import express from "express";
import { CartItem } from "../models/CartItems";

// // create a new Router object
const cartRouter = express.Router();

const cart: CartItem[] = [
  {
    id: 1,
    product: "Orange",
    price: 3,
    quantity: 5,
  },
  {
    id: 2,
    product: "apple",
    price: 4,
    quantity: 4,
  },
  {
    id: 3,
    product: "Papaya",
    price: 2,
    quantity: 2,
  },
  {
    id: 4,
    product: "Avocado",
    price: 5,
    quantity: 3,
  },
];

let nextId = 5;

cartRouter.get("/cart", (req, res) => {
  console.log(req.query);
  res.status(200);
  res.json(cart);
});

cartRouter.get("/cart-items", (req, res) => {
  const { maxPrice, prefix, pageSize } = req.query; //destructuring the query
  let results = cart;

  if (maxPrice) {
    results = cart.filter((item) => item.price <= Number(maxPrice)); //+maxPrice also same as converting to number
    //results = cart.filter((item) => item.price <= +maxPrice);
  }
  if (prefix) {
    results = cart.filter((item) =>
      item.product.toLowerCase().startsWith(prefix.toString().toLowerCase())
    );
  }
  if (pageSize) {
    results = results.slice(0, Number(pageSize));
  }

  res.status(200);
  res.json(results);
});

cartRouter.get("/cart-items/:id", (req, res) => {
  //let {id} = req.params;
  let id: number = parseInt(req.params.id);
  //res.json(id);
  const foundItem = cart.find((item) => item.id === id);
  if (foundItem) {
    res.status(200);
    res.json(foundItem);
  } else {
    res.status(404);
    res.json(`ID ${id} Not Found`);
  }
});

//POST ---> create(add one)
cartRouter.post("/cart-items", (req, res) => {
  const newCartItem = req.body;
  newCartItem.id = nextId++;
  cart.push(newCartItem);
  console.log(newCartItem);
  res.status(201);
  res.json(newCartItem);
});

//PUT/cart-items/:id //Update
cartRouter.put("/cart-items/:id", (req, res) => {
  let { id } = req.params;
  let updatedCart = req.body;
  //find the index
  let index = cart.findIndex((item) => item.id === Number(id));
  if (index > -1) {
    // i.e index found
    cart[index] = updatedCart;
    res.status(200);
    res.json(updatedCart);
  } else {
    res.status(404);
    res.json(`No Products found with ID: ${id}`);
  }
});

//Delete;
cartRouter.delete("/cart-items/:id", (req, res) => {
  let { id } = req.params; //access to id
  let updatedCart = req.body;
  // first find the index(findIndex)
  const index = cart.findIndex((item) => item.id === Number(id));
  // now remove that index(splice)
  if (index > -1) {
    //ie it is found
    updatedCart = cart.splice(index, 1);
    res.status(204);
    res.json(updatedCart);
  } else {
    res.json(cart);
  }
});

export default cartRouter;
