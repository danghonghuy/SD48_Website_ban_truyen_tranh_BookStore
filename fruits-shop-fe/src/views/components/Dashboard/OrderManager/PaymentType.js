import React, { useState } from 'react';
import { Modal, Button, Image } from 'antd';

function formatCurrencyVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}


const PaymentType = ({ callback, amount, deliveryId, paymentId }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Function to show the modal
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Function to handle closing the modal
    const handleOk = () => {
        callback();
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Button type="primary" onClick={showModal}>
                Payment
            </Button>

            <Modal
                title="Payment"
                visible={isModalVisible}
                onOk={handleOk} // Button to confirm payment
                onCancel={handleCancel} // Button to close the modal
            >
                {deliveryId && deliveryId === 1 && <>
                    {paymentId && paymentId === 1 && <>
                        <p>Số tiền cần phải thanh toán: </p>
                        <h2>{formatCurrencyVND(amount)}</h2>
                    </>}

                    {paymentId && paymentId === 2 && <>
                        <p>Quét QR Code để thanh toán: </p>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '50vh', // Makes the parent container full height
                            textAlign: 'center' // Ensures text is also centered
                        }}>
                            <Image
                                width={350}  // Set the width of the image
                                src='https://hexdocs.pm/qr_code/docs/qrcode.svg'  // Image source (URL)
                                alt="Example Image"  // Alt text for the image
                                preview={true}  // Enable the lightbox preview feature
                            />
                        </div>
                    </>}
                </>
                }
                {deliveryId && deliveryId !== 1 && <>
                    <p>Xác nhận đơn hàng giao cho đơn vị vận chuyển: </p>
                    <h2>Giá trị: {formatCurrencyVND(amount)}</h2>
                </>
                }
            </Modal>
        </div>
    );
};

export default PaymentType;
