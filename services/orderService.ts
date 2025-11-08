import { Order, CartItem, User, OrderStatus, DeliveryInfo } from '../types';

const ORDERS_DB_KEY = 'printShopOrders';

// --- Helper Functions ---
const getAllOrdersFromDb = (): Order[] => {
    try {
        const ordersJson = localStorage.getItem(ORDERS_DB_KEY);
        return ordersJson ? JSON.parse(ordersJson) : [];
    } catch (e) {
        console.error("Failed to parse orders from DB", e);
        return [];
    }
};

const saveOrdersToDb = (orders: Order[]): void => {
    try {
        localStorage.setItem(ORDERS_DB_KEY, JSON.stringify(orders));
    } catch (e) {
        console.error("Failed to save orders", e);
    }
};


// --- Public Service Functions ---

/**
 * Creates a new order and saves it.
 */
export const createOrder = async (items: CartItem[], user: User, totalAmount: number): Promise<Order> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        customer: {
            phoneNumber: user.phoneNumber,
            fullName: user.fullName
        },
        date: new Date().toISOString(),
        totalAmount,
        status: 'new',
        items: items,
    };
    
    const existingOrders = getAllOrdersFromDb();
    saveOrdersToDb([newOrder, ...existingOrders]);
    return newOrder;
};

/**
 * Updates an existing order with delivery information.
 */
export const updateOrderDelivery = async (orderId: string, deliveryInfo: DeliveryInfo): Promise<Order | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const allOrders = getAllOrdersFromDb();
    let updatedOrder: Order | null = null;
    const updatedOrders = allOrders.map(o => {
        if (o.id === orderId) {
            updatedOrder = { ...o, delivery: deliveryInfo };
            return updatedOrder;
        }
        return o;
    });

    if (updatedOrder) {
        saveOrdersToDb(updatedOrders);
    }
    
    return updatedOrder;
}

/**
 * Updates the status of a specific order.
 */
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order | null> => {
     // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const allOrders = getAllOrdersFromDb();
    let updatedOrder: Order | null = null;
    const updatedOrders = allOrders.map(o => {
        if (o.id === orderId) {
            updatedOrder = { ...o, status };
            return updatedOrder;
        }
        return o;
    });

    if (updatedOrder) {
        saveOrdersToDb(updatedOrders);
    }
    
    return updatedOrder;
}


/**
 * Retrieves all orders for a specific user.
 */
export const getOrdersForUser = (phoneNumber: string): Order[] => {
    const allOrders = getAllOrdersFromDb();
    return allOrders.filter(order => order.customer.phoneNumber === phoneNumber);
};

/**
 * Retrieves all orders (for admin).
 */
export const getAllOrders = (): Order[] => {
    return getAllOrdersFromDb();
};

/**
 * Retrieves a single order by its ID.
 */
export const getOrderById = (orderId: string): Order | null => {
    const allOrders = getAllOrdersFromDb();
    return allOrders.find(o => o.id === orderId) || null;
}
