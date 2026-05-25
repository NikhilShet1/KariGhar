const { supabase, supabaseAdmin } = require('../config/supabase');

/**
 * POST /api/orders
 * Protected — buyers only.
 * Body: { seller_id, items: [{ product_id, quantity, price }] }
 * Atomically creates the order + order_items + decrements stock.
 */
const placeOrder = async (req, res, next) => {
  const { seller_id, items } = req.body;

  if (!seller_id || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    return next(new Error('seller_id and at least one item are required'));
  }

  const total_amount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // 1. Create the order row
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({ buyer_id: req.user.id, seller_id, total_amount })
    .select()
    .single();

  if (orderError) {
    res.status(500);
    return next(new Error(`Order creation failed: ${orderError.message}`));
  }

  // 2. Insert all order_items
  const orderItems = items.map(({ product_id, quantity, price }) => ({
    order_id: order.id,
    product_id,
    quantity,
    price,
  }));

  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    res.status(500);
    return next(new Error(`Order items failed: ${itemsError.message}`));
  }

  // 3. Decrement stock for each product
  for (const { product_id, quantity } of items) {
    const { data: prod } = await supabase
      .from('products')
      .select('stock')
      .eq('id', product_id)
      .single();

    if (prod) {
      await supabaseAdmin
        .from('products')
        .update({ stock: Math.max(0, prod.stock - quantity) })
        .eq('id', product_id);
    }
  }

  // 4. Seed initial tracking entry
  await supabaseAdmin
    .from('order_tracking')
    .insert({ order_id: order.id, status: 'pending' });

  res.status(201).json({ message: 'Order placed successfully', order });
};

/**
 * GET /api/orders
 * Protected — returns orders belonging to the authenticated user (buyer or seller).
 */
const getMyOrders = async (req, res, next) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, total_amount, order_status, created_at,
      buyer:profiles!orders_buyer_id_fkey(id, full_name),
      seller:profiles!orders_seller_id_fkey(id, full_name),
      order_items(id, quantity, price, product:products(id, title, image_urls))
    `)
    .or(`buyer_id.eq.${req.user.id},seller_id.eq.${req.user.id}`)
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500);
    return next(new Error(error.message));
  }

  res.json({ orders: data });
};

/**
 * GET /api/orders/:id
 * Protected — returns a single order with full tracking history.
 */
const getOrderById = async (req, res, next) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      buyer:profiles!orders_buyer_id_fkey(id, full_name, phone_number),
      seller:profiles!orders_seller_id_fkey(id, full_name, phone_number),
      order_items(id, quantity, price, product:products(id, title, image_urls, description)),
      order_tracking(id, status, updated_at)
    `)
    .eq('id', id)
    .or(`buyer_id.eq.${req.user.id},seller_id.eq.${req.user.id}`)
    .single();

  if (error || !data) {
    res.status(404);
    return next(new Error('Order not found or access denied'));
  }

  res.json({ order: data });
};

/**
 * PATCH /api/orders/:id/status
 * Protected — seller only. Updates order_status + appends tracking row.
 * Body: { status: 'packed' | 'shipped' | 'delivered' }
 */
const updateOrderStatus = async (req, res, next) => {
  const { id }     = req.params;
  const { status } = req.body;
  const validStatuses = ['pending', 'packed', 'shipped', 'delivered'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    return next(new Error(`status must be one of: ${validStatuses.join(', ')}`));
  }

  // Confirm this seller owns the order
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('seller_id')
    .eq('id', id)
    .single();

  if (fetchError || !order) {
    res.status(404);
    return next(new Error('Order not found'));
  }

  if (order.seller_id !== req.user.id) {
    res.status(403);
    return next(new Error('Forbidden — you are not the seller for this order'));
  }

  // Update status
  const { data: updated, error: updateError } = await supabase
    .from('orders')
    .update({ order_status: status })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    res.status(500);
    return next(new Error(updateError.message));
  }

  // Append tracking log
  await supabaseAdmin
    .from('order_tracking')
    .insert({ order_id: id, status });

  res.json({ message: `Order marked as ${status}`, order: updated });
};

module.exports = { placeOrder, getMyOrders, getOrderById, updateOrderStatus };
