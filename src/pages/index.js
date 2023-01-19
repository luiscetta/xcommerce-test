import { Helmet } from "react-helmet";
import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Button, Container, Navbar } from "react-bootstrap";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import BestSellers from "../components/BestSellers";
import Products from "../components/Products";
import Loading from "../components/Loader";
import CreateNewItemModal from "../components/Modal/CreateNewItemModal";

import styles from '../../styles/Home.module.scss';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const reloadProducts = () => getProducts().then((result) => setProducts(result));
  const getProducts = async () => {
    const { data } = await axios.get("/api/products");
    return data.products;
  };

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const allProducts = await getProducts();
        if (products.length !== allProducts.length) {
          setProducts(allProducts);
          setBestSellers(allProducts.filter(p => p.sales > 200));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [products.length]);

  return (
    <>
      <Helmet>
        <title>XCO+ Store</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      <Navbar className={styles.navbar_products}>
        <Container className={styles.container_products}>
          <h2>Produtos</h2>
          <div className={styles.input_container}>
            <MagnifyingGlassIcon className={styles.search_icon} />
            <input
              type="search"
              placeholder="Buscar por produtos"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </Container>
      </Navbar>
      <Navbar className={styles.navbar_buttons}>
        <Container className={styles.container_buttons}>
          <div className={styles.left_buttons}>
            <Button className={showFavorites ? styles.home_button_unselected : styles.home_button} onClick={() => setShowFavorites(false)}>Todas</Button>
            <Button className={showFavorites ? styles.favorite_button : styles.favorite_button_unselected} onClick={() => setShowFavorites(true)}>Favoritos</Button>
          </div>

          <Button className={styles.create_button} onClick={handleShowModal}>Criar novo</Button>
          <CreateNewItemModal handleCloseModal={handleCloseModal} show={showModal} reloadProducts={reloadProducts} />
        </Container>
      </Navbar>

      {
        loading ? <Loading />
          :
          <main className={styles.main}>
            <BestSellers
              products={bestSellers}
            />
            <Products
              search={search}
              products={products}
              showFavorites={showFavorites}
            />
          </main>
      }
    </>
  )
}
