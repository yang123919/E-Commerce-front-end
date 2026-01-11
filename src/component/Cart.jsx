import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button } from "@mui/material";
import { toast } from "sonner";

function CartPage() {
    const [cartItems, setCartItems] = useState([]);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(savedCart);
    }, []);

    // Remove item from cart
    const removeItem = (productId) => {
        const updatedCart = cartItems.filter((item) => item.id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toast.success("Item removed from cart");
    };

    // Checkout
    const checkout = () => {
        if (cartItems.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const newOrder = {
            id: Date.now(),
            items: cartItems,
            status: "Pending",
            date: Date.now(),
        };
        localStorage.setItem("orders", JSON.stringify([newOrder, ...savedOrders]));
        setCartItems([]);
        localStorage.setItem("cart", JSON.stringify([]));
        toast.success("Order placed successfully!");
    };

    // Total price
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

    if (cartItems.length === 0) {
        return (
            <Box mt={5} textAlign="center">
                <Typography variant="h6">No products in cart</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: 1200, mx: "auto", mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Cart
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Price ($)</TableCell>
                            <TableCell align="right">Qty</TableCell>
                            <TableCell align="right">Total ($)</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cartItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell align="right">{item.price}</TableCell>
                                <TableCell align="right">{item.quantity}</TableCell>
                                <TableCell align="right">{(item.price * item.quantity).toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained" color="error" size="small" onClick={() => removeItem(item.id)}>
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box mt={3} textAlign="right">
                <Typography variant="h6">Total: ${totalPrice.toFixed(2)}</Typography>
                <Button variant="contained" size="large" onClick={checkout} sx={{ mt: 2 }}>
                    Checkout
                </Button>
            </Box>
        </Box>
    );
}

export default CartPage;
