import { Router, type IRouter } from "express";
import { and, countDistinct, desc, eq, ilike, or } from "drizzle-orm";
import {
  AddCartItemBody,
  AddCartItemParams,
  CreateBuyerBody,
  CreateCartParams,
  CreateOrderBody,
  CreateOrderParams,
  CreateProductBody,
  CreateSellerBody,
  DeleteProductParams,
  GetBuyerParams,
  GetCartParams,
  GetOrderParams,
  GetProductParams,
  GetSellerOrderCountParams,
  GetSellerParams,
  ListBuyerOrdersParams,
  ListProductsQueryParams,
  ListSellerOrdersParams,
  RemoveCartItemParams,
  UpdateCartItemBody,
  UpdateCartItemParams,
  UpdateOrderStatusBody,
  UpdateOrderStatusParams,
  UpdateProductBody,
  UpdateProductParams,
  UpdateSellerBody,
  UpdateSellerParams,
} from "@workspace/api-zod";
import { db } from "@workspace/db";
import {
  buyers,
  cartItems,
  carts,
  orderItems,
  orders,
  products,
  sellers,
} from "@workspace/db/schema";

const router: IRouter = Router();

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

class NotFoundError extends Error {}

const notFound = (message: string): never => {
  throw new NotFoundError(message);
};

const parseId = (value: string): number => {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw new Error("ID must be a positive integer");
  }
  return id;
};

const numberValue = (value: string | number): number => Number(value);

const sendError = (req: any, res: any, error: unknown, message: string) => {
  if (error instanceof NotFoundError) {
    res.status(404).json({ error: error.message });
    return;
  }

  req.log.error({ err: error }, message);
  res.status(500).json({ error: message });
};

const sellerCount = async (sellerId: number) => {
  const [result] = await db
    .select({ count: countDistinct(orderItems.orderId) })
    .from(orderItems)
    .where(eq(orderItems.sellerId, sellerId));
  return Number(result?.count ?? 0);
};

const serializeSeller = async (seller: typeof sellers.$inferSelect) => ({
  id: seller.id,
  name: seller.name,
  whatsapp: seller.whatsapp,
  location: seller.location,
  product: seller.product,
  createdAt: seller.createdAt,
  updatedAt: seller.updatedAt,
  orderCount: await sellerCount(seller.id),
});

const serializeProduct = ({
  product,
  seller,
}: {
  product: typeof products.$inferSelect;
  seller: typeof sellers.$inferSelect;
}) => ({
  id: product.id,
  name: product.name,
  details: product.details,
  price: numberValue(product.price),
  category: product.category,
  description: product.description,
  location: product.location,
  image: product.image,
  sellerId: product.sellerId,
  seller: {
    id: seller.id,
    name: seller.name,
    whatsapp: seller.whatsapp,
    location: seller.location,
  },
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const getProductDetails = async (productId: number) => {
  const [row] = await db
    .select({ product: products, seller: sellers })
    .from(products)
    .innerJoin(sellers, eq(products.sellerId, sellers.id))
    .where(eq(products.id, productId))
    .limit(1);
  return row ? serializeProduct(row) : notFound("Product not found");
};

const getOpenCart = async (buyerId: number, create = false) => {
  const [buyer] = await db
    .select()
    .from(buyers)
    .where(eq(buyers.id, buyerId))
    .limit(1);
  if (!buyer) notFound("Buyer not found");

  let [cart] = await db
    .select()
    .from(carts)
    .where(and(eq(carts.buyerId, buyerId), eq(carts.status, "open")))
    .limit(1);

  if (!cart && create) {
    [cart] = await db
      .insert(carts)
      .values({ buyerId, status: "open" })
      .returning();
  }

  return cart ?? notFound("Cart not found");
};

const serializeCart = async (cart: typeof carts.$inferSelect) => {
  const rows = await db
    .select({ item: cartItems, product: products, seller: sellers })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .innerJoin(sellers, eq(products.sellerId, sellers.id))
    .where(eq(cartItems.cartId, cart.id));

  const items = rows.map(({ item, product, seller }) => {
    const price = numberValue(product.price);
    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: serializeProduct({ product, seller }),
      subtotal: price * item.quantity,
    };
  });

  return {
    id: cart.id,
    buyerId: cart.buyerId,
    status: cart.status as "open" | "checked_out",
    items,
    total: items.reduce((total, item) => total + item.subtotal, 0),
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
};

const serializeOrder = async (order: typeof orders.$inferSelect) => {
  const rows = await db
    .select({ item: orderItems, product: products, seller: sellers })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .innerJoin(sellers, eq(orderItems.sellerId, sellers.id))
    .where(eq(orderItems.orderId, order.id));

  return {
    id: order.id,
    buyerId: order.buyerId,
    status: order.status as (typeof ORDER_STATUSES)[number],
    total: numberValue(order.total),
    deliveryLocation: order.deliveryLocation,
    items: rows.map(({ item, product, seller }) => {
      const unitPrice = numberValue(item.unitPrice);
      return {
        id: item.id,
        productId: item.productId,
        sellerId: item.sellerId,
        quantity: item.quantity,
        unitPrice,
        subtotal: unitPrice * item.quantity,
        productName: product.name,
        sellerName: seller.name,
      };
    }),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};

router.post("/sellers", async (req, res) => {
  try {
    const input = CreateSellerBody.parse(req.body);
    const [seller] = await db.insert(sellers).values(input).returning();
    res.status(201).json(await serializeSeller(seller));
  } catch (error) {
    sendError(req, res, error, "Unable to create seller");
  }
});

router.get("/sellers/:sellerId", async (req, res) => {
  try {
    const { sellerId } = GetSellerParams.parse(req.params);
    const [seller] = await db
      .select()
      .from(sellers)
      .where(eq(sellers.id, sellerId))
      .limit(1);
    if (!seller) notFound("Seller not found");
    res.json(await serializeSeller(seller));
  } catch (error) {
    sendError(req, res, error, "Unable to retrieve seller");
  }
});

router.patch("/sellers/:sellerId", async (req, res) => {
  try {
    const { sellerId } = UpdateSellerParams.parse(req.params);
    const input = UpdateSellerBody.parse(req.body);
    const [seller] = await db
      .update(sellers)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(sellers.id, sellerId))
      .returning();
    if (!seller) notFound("Seller not found");
    res.json(await serializeSeller(seller));
  } catch (error) {
    sendError(req, res, error, "Unable to update seller");
  }
});

router.post("/buyers", async (req, res) => {
  try {
    const input = CreateBuyerBody.parse(req.body);
    const [buyer] = await db.insert(buyers).values(input).returning();
    res.status(201).json(buyer);
  } catch (error) {
    sendError(req, res, error, "Unable to create buyer");
  }
});

router.get("/buyers/:buyerId", async (req, res) => {
  try {
    const { buyerId } = GetBuyerParams.parse(req.params);
    const [buyer] = await db
      .select()
      .from(buyers)
      .where(eq(buyers.id, buyerId))
      .limit(1);
    if (!buyer) notFound("Buyer not found");
    res.json(buyer);
  } catch (error) {
    sendError(req, res, error, "Unable to retrieve buyer");
  }
});

router.get("/products", async (req, res) => {
  try {
    const { search, category } = ListProductsQueryParams.parse(req.query);
    const conditions = [];
    if (search) {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`),
          ilike(products.location, `%${search}%`),
        ),
      );
    }
    if (category && category !== "All") {
      conditions.push(eq(products.category, category));
    }
    const rows = await db
      .select({ product: products, seller: sellers })
      .from(products)
      .innerJoin(sellers, eq(products.sellerId, sellers.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(products.createdAt));
    res.json(rows.map(serializeProduct));
  } catch (error) {
    sendError(req, res, error, "Unable to list products");
  }
});

router.post("/products", async (req, res) => {
  try {
    const input = CreateProductBody.parse(req.body);
    const [seller] = await db
      .select()
      .from(sellers)
      .where(eq(sellers.id, input.sellerId))
      .limit(1);
    if (!seller) notFound("Seller not found");
    const [product] = await db
      .insert(products)
      .values({
        ...input,
        price: input.price.toFixed(2),
      })
      .returning();
    res.status(201).json(await getProductDetails(product.id));
  } catch (error) {
    sendError(req, res, error, "Unable to create product");
  }
});

router.get("/products/:productId", async (req, res) => {
  try {
    const { productId } = GetProductParams.parse(req.params);
    res.json(await getProductDetails(productId));
  } catch (error) {
    sendError(req, res, error, "Unable to retrieve product");
  }
});

router.patch("/products/:productId", async (req, res) => {
  try {
    const { productId } = UpdateProductParams.parse(req.params);
    const input = UpdateProductBody.parse(req.body);
    const [product] = await db
      .update(products)
      .set({
        ...input,
        price: input.price === undefined ? undefined : input.price.toFixed(2),
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning();
    if (!product) notFound("Product not found");
    res.json(await getProductDetails(product.id));
  } catch (error) {
    sendError(req, res, error, "Unable to update product");
  }
});

router.delete("/products/:productId", async (req, res) => {
  try {
    const { productId } = DeleteProductParams.parse(req.params);
    const [product] = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning();
    if (!product) notFound("Product not found");
    res.status(204).send();
  } catch (error) {
    sendError(req, res, error, "Unable to delete product");
  }
});

router.get("/buyers/:buyerId/cart", async (req, res) => {
  try {
    const { buyerId } = GetCartParams.parse(req.params);
    res.json(await serializeCart(await getOpenCart(buyerId, true)));
  } catch (error) {
    sendError(req, res, error, "Unable to retrieve cart");
  }
});

router.post("/buyers/:buyerId/cart", async (req, res) => {
  try {
    const { buyerId } = CreateCartParams.parse(req.params);
    const cart = await getOpenCart(buyerId, true);
    res.status(201).json(await serializeCart(cart));
  } catch (error) {
    sendError(req, res, error, "Unable to create cart");
  }
});

router.post("/buyers/:buyerId/cart/items", async (req, res) => {
  try {
    const { buyerId } = AddCartItemParams.parse(req.params);
    const input = AddCartItemBody.parse(req.body);
    const cart = await getOpenCart(buyerId, true);
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, input.productId))
      .limit(1);
    if (!product) notFound("Product not found");

    const [existing] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cart.id),
          eq(cartItems.productId, input.productId),
        ),
      )
      .limit(1);
    if (existing) {
      await db
        .update(cartItems)
        .set({ quantity: existing.quantity + input.quantity })
        .where(eq(cartItems.id, existing.id));
    } else {
      await db.insert(cartItems).values({ cartId: cart.id, ...input });
    }
    await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cart.id));
    res.json(await serializeCart(cart));
  } catch (error) {
    sendError(req, res, error, "Unable to add cart item");
  }
});

router.patch("/buyers/:buyerId/cart/items/:productId", async (req, res) => {
  try {
    const { buyerId, productId } = UpdateCartItemParams.parse(req.params);
    const { quantity } = UpdateCartItemBody.parse(req.body);
    const cart = await getOpenCart(buyerId);
    const [item] = await db
      .update(cartItems)
      .set({ quantity })
      .where(
        and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)),
      )
      .returning();
    if (!item) notFound("Cart item not found");
    await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cart.id));
    res.json(await serializeCart(cart));
  } catch (error) {
    sendError(req, res, error, "Unable to update cart item");
  }
});

router.delete("/buyers/:buyerId/cart/items/:productId", async (req, res) => {
  try {
    const { buyerId, productId } = RemoveCartItemParams.parse(req.params);
    const cart = await getOpenCart(buyerId);
    const [item] = await db
      .delete(cartItems)
      .where(
        and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)),
      )
      .returning();
    if (!item) notFound("Cart item not found");
    await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cart.id));
    res.json(await serializeCart(cart));
  } catch (error) {
    sendError(req, res, error, "Unable to remove cart item");
  }
});

router.get("/buyers/:buyerId/orders", async (req, res) => {
  try {
    const { buyerId } = ListBuyerOrdersParams.parse(req.params);
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.buyerId, buyerId))
      .orderBy(desc(orders.createdAt));
    res.json(await Promise.all(rows.map(serializeOrder)));
  } catch (error) {
    sendError(req, res, error, "Unable to list buyer orders");
  }
});

router.post("/buyers/:buyerId/orders", async (req, res) => {
  try {
    const { buyerId } = CreateOrderParams.parse(req.params);
    const input = CreateOrderBody.parse(req.body ?? {});
    const cart = await getOpenCart(buyerId);
    const rows = await db
      .select({ item: cartItems, product: products })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cart.id));
    if (rows.length === 0) {
      res.status(400).json({ error: "Cannot create an order from an empty cart" });
      return;
    }

    const [buyer] = await db.select().from(buyers).where(eq(buyers.id, buyerId)).limit(1);
    if (!buyer) notFound("Buyer not found");
    const deliveryLocation = input.deliveryLocation || buyer.location;
    const total = rows.reduce(
      (sum, { item, product }) => sum + numberValue(product.price) * item.quantity,
      0,
    );

    const order = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(orders)
        .values({
          buyerId,
          status: "pending",
          total: total.toFixed(2),
          deliveryLocation,
        })
        .returning();

      await tx.insert(orderItems).values(
        rows.map(({ item, product }) => ({
          orderId: created.id,
          productId: product.id,
          sellerId: product.sellerId,
          quantity: item.quantity,
          unitPrice: product.price,
        })),
      );
      await tx
        .update(carts)
        .set({ status: "checked_out", updatedAt: new Date() })
        .where(eq(carts.id, cart.id));
      return created;
    });

    res.status(201).json(await serializeOrder(order));
  } catch (error) {
    sendError(req, res, error, "Unable to create order");
  }
});

router.get("/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = GetOrderParams.parse(req.params);
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);
    if (!order) notFound("Order not found");
    res.json(await serializeOrder(order));
  } catch (error) {
    sendError(req, res, error, "Unable to retrieve order");
  }
});

router.patch("/orders/:orderId/status", async (req, res) => {
  try {
    const { orderId } = UpdateOrderStatusParams.parse(req.params);
    const { status } = UpdateOrderStatusBody.parse(req.body);
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();
    if (!order) notFound("Order not found");
    res.json(await serializeOrder(order));
  } catch (error) {
    sendError(req, res, error, "Unable to update order status");
  }
});

const listOrdersForSeller = async (sellerId: number) => {
  const orderIds = await db
    .selectDistinct({ orderId: orderItems.orderId })
    .from(orderItems)
    .where(eq(orderItems.sellerId, sellerId));
  const rows = await Promise.all(
    orderIds.map(async ({ orderId }) => {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);
      return order ? serializeOrder(order) : null;
    }),
  );
  return rows.filter((order): order is NonNullable<typeof order> => order !== null);
};

router.get("/sellers/:sellerId/orders", async (req, res) => {
  try {
    const { sellerId } = ListSellerOrdersParams.parse(req.params);
    res.json(await listOrdersForSeller(sellerId));
  } catch (error) {
    sendError(req, res, error, "Unable to list seller orders");
  }
});

router.get("/sellers/:sellerId/orders/count", async (req, res) => {
  try {
    const { sellerId } = GetSellerOrderCountParams.parse(req.params);
    res.json({ sellerId, count: await sellerCount(sellerId) });
  } catch (error) {
    sendError(req, res, error, "Unable to count seller orders");
  }
});

export default router;