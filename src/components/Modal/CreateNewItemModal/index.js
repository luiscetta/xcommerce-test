import axios from 'axios';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import CurrencyInput from 'react-currency-input';

import styles from './CreateNewItemModal.module.scss';

export default function CreateNewItemModal({ handleCloseModal, reloadProducts, show }) {
    const imageDefault = "https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg";

    const [productImage, setProductImage] = useState(imageDefault);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productStock, setProductStock] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("api/products", {
            image: productImage,
            name: productName,
            price: productPrice,
            stock: productStock,
        })
        .then(() => {
            reloadProducts();
            handleCloseModal();
        });
    }

    const handleImageUpload = (e) => {
        const [file] = e.target.files;
        console.log("Image from input:", file);
        const reader = new FileReader();
        reader.addEventListener("load", () => setProductImage(reader.result));
        reader.readAsDataURL(file);
    };

    const formatPrice = (e = {}, maskedValue) => {
        const value = maskedValue.replace('R$', '');
        setProductPrice(value);
    }

    return (
        <>
            <Modal
                centered
                show={show}
                onHide={handleCloseModal}
                backdrop="static"
                keyboard={false}
                className={styles.modal_container}
            >
                <Modal.Header closeButton className={styles.modal_header}>
                    <Modal.Title className={styles.modal_title}>Criar item</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modal_body}>
                    <form className={styles.modal_form} onSubmit={handleSubmit}>
                        <label htmlFor="image">Imagem do produto</label>
                        <input
                            id="image"
                            type="file"
                            name='image'
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="name">Nome do produto</label>
                        <input
                            id="name"
                            type="text"
                            name='name'
                            required
                            placeholder='Digite o nome do produto'
                            onChange={({ target }) => setProductName(target.value)}
                        />
                        <label htmlFor="price">Preço</label>
                        <CurrencyInput
                            id="price"
                            required
                            prefix="R$"
                            decimalSeparator=","
                            thousandSeparator="."
                            precision={2}
                            allowNegative={false}
                            name="price"
                            placeholder='R$00,00'
                            onChangeEvent={formatPrice}
                            value={productPrice}
                        />
                        <label htmlFor="stock">Estoque</label>
                        <input
                            id="stock"
                            type="number"
                            name="stock"
                            required
                            placeholder='Digite a quantidade do estoque'
                            onChange={({ target }) => setProductStock(target.value)}
                        />
                        <Modal.Footer className={styles.modal_footer}>
                            <Button variant="secondary" onClick={handleCloseModal} className={styles.close_modal_button}>
                                Fechar
                            </Button>
                            <Button type="submit" variant="primary" className={styles.create_item_button}>Criar</Button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}
