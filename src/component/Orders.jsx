import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button } from "@mui/material";

function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        setOrders(savedOrders);
    }, []);

    const deleteOrder = (id) => {
        const updatedOrders = orders.filter((order) => order.id !== id);
        setOrders(updatedOrders);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
    };

    const getOrderTotal = (order) => {
        return order.items?.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0) || 0;
    };

    if (orders.length === 0) {
        return (
            <Box mt={5} textAlign="center">
                <Typography variant="h6">No orders yet</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: 1200, mx: "auto", mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                My Orders
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Products</TableCell>
                            <TableCell>Total ($)</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>
                                    {order.items?.map((item, idx) => (
                                        <div key={idx}>
                                            {item.name} x {item.quantity || 1}
                                        </div>
                                    )) || "No items"}
                                </TableCell>
                                <TableCell>${getOrderTotal(order).toFixed(2)}</TableCell>
                                <TableCell>{order.status || "Pending"}</TableCell>
                                <TableCell>{new Date(order.date).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="error" size="small" onClick={() => deleteOrder(order.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default OrdersPage;
