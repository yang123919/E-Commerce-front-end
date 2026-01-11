import React, { useEffect, useState } from "react";
import { Button, Modal, Card, Row, Col, Form, Container } from "react-bootstrap";
import { toast } from "sonner";
import "bootstrap/dist/css/bootstrap.min.css";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/productApi";
import "../App.css";

function HomePage() {
    const [products, setProducts] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", category: "" });
    const [allCategories, setAllCategories] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        const data = await getProducts();
        setProducts(data);
    };

    const fetchCategories = async () => {
        const res = await fetch("http://localhost:2000/categories");
        const data = await res.json();
        setAllCategories(data);
    };

    const addProduct = async (e) => {
        e.preventDefault();
        const { name, description, price, category } = newProduct;

        if (!name.trim() || !price || !category || !description.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            await createProduct({
                ...newProduct,
                price: Number(price),
                category, // send category ID
            });

            toast.success("Product added successfully");
            setNewProduct({ name: "", description: "", price: "", category: "" });
            setShowAdd(false);
            fetchProducts();
        } catch (error) {
            toast.error("Failed to add product");
            console.error(error);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const updated = await updateProduct(currentProduct._id, {
                ...currentProduct,
                price: Number(currentProduct.price),
                category: currentProduct.category, // ID or object depends on backend
            });

            setProducts(products.map((p) => (p._id === updated._id ? updated : p)));
            toast.success("Product updated successfully");
            setShowEdit(false);
        } catch (error) {
            toast.error("Failed to update product");
            console.error(error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await deleteProduct(id);
            setProducts(products.filter((p) => p._id !== id));
            toast.success("Product deleted successfully");
        } catch (error) {
            toast.error("Failed to delete product");
            console.error(error);
        }
    };

    const addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find((item) => item._id === product._id);
        if (existing) existing.quantity += 1;
        else cart.push({ ...product, quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        toast.success(`"${product.name}" added to cart`);
    };

    const filteredProducts = selectedCategory === "All" ? products : products.filter((p) => p.category?._id === selectedCategory);

    return (
        <Container className="mt-4">
            {/* Header */}
            <div className="d-flex justify-content-between mb-3">
                <h3>Products</h3>
                <Button className="bg-success" onClick={() => setShowAdd(true)}>
                    Add New
                </Button>
            </div>

            {/* Category Filter */}
            <Form.Select className="mb-4 w-25" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="All">All</option>
                {allCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                        {cat.name}
                    </option>
                ))}
            </Form.Select>

            {/* Product Grid */}
            <Row className="g-4">
                {filteredProducts.map((product) => {
                    const isSingle = filteredProducts.length === 1;
                    return (
                        <Col key={product._id} xs={12} md={isSingle ? 8 : 6} lg={isSingle ? 6 : 4} className="d-flex">
                            <Card className="flex-fill">
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text className="text-muted flex-grow-1">{product.description}</Card.Text>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="price-badge">${product.price}</span>
                                        <span className="category-badge">{product.category?.name || "N/A"}</span>
                                    </div>

                                    <Button className="w-100 mb-2" onClick={() => addToCart(product)}>
                                        Add To Cart
                                    </Button>

                                    <div className="d-flex justify-content-between">
                                        <Button
                                            size="m"
                                            onClick={() => {
                                                setCurrentProduct({
                                                    ...product,
                                                    category: product.category?._id,
                                                });
                                                setShowEdit(true);
                                            }}
                                            style={{ borderRadius: "20px", width: "80px" }}
                                        >
                                            Edit
                                        </Button>
                                        <Button size="m" variant="danger" onClick={() => handleDeleteProduct(product._id)} style={{ borderRadius: "20px", width: "80px" }}>
                                            Delete
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* Add Product Modal */}
            <Modal show={showAdd} onHide={() => setShowAdd(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addProduct}>
                        <Form.Control className="mb-2" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                        <Form.Control className="mb-2" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                        <Form.Control className="mb-2" type="number" step="0.01" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                        <Form.Select className="mb-3" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                            <option value="">Select Category</option>
                            {allCategories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </Form.Select>
                        <Button type="submit" className="w-100">
                            Add Product
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Product Modal */}
            <Modal show={showEdit} onHide={() => setShowEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentProduct && (
                        <Form onSubmit={handleUpdateProduct}>
                            <Form.Control className="mb-2" value={currentProduct.name} onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })} />
                            <Form.Control className="mb-2" value={currentProduct.description} onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })} />
                            <Form.Control className="mb-2" type="number" step="0.01" value={currentProduct.price} onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })} />
                            <Form.Select className="mb-3" value={currentProduct.category} onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}>
                                {allCategories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Button type="submit" className="w-100">
                                Save Changes
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default HomePage;
