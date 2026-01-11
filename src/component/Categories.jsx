import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const API_URL = "http://localhost:2000/categories";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");

    const fetchCategories = async () => {
        const res = await fetch(API_URL);
        const data = await res.json();
        setCategories(data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const addCategory = async () => {
        if (!newCategory.trim()) return;

        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newCategory }),
        });

        setNewCategory("");
        fetchCategories();
    };

    const editCategory = async (cat) => {
        const newName = prompt("Enter new category name:", cat.name);
        if (!newName) return;

        await fetch(`${API_URL}/${cat._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName }),
        });

        fetchCategories();
    };

    const deleteCategory = async (cat) => {
        if (!window.confirm(`Delete "${cat.name}"?`)) return;

        await fetch(`${API_URL}/${cat._id}`, {
            method: "DELETE",
        });

        fetchCategories();
    };

    return (
        <Box sx={{ width: 600, mx: "auto", mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Categories
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField fullWidth label="Category Name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                <Button variant="contained" onClick={addCategory}>
                    ADD
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat._id}>
                                <TableCell>{cat.name}</TableCell>
                                <TableCell align="center">
                                    <Button size="small" variant="contained" onClick={() => editCategory(cat)} sx={{ mr: 1 }}>
                                        Edit
                                    </Button>
                                    <Button size="small" color="error" variant="contained" onClick={() => deleteCategory(cat)}>
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

export default Categories;
