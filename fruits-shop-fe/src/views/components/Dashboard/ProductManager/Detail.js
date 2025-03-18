import useProduct from "@api/useProduct";
import StarRating from "@components/Rate/StarRating";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import notImg from "../../../../assets/assets/images/logos/web.png";
import { toast } from "react-toastify";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons";

function Detail() {
    const [product, setProduct] = useState({});
    const { getAllById } = useProduct();

    const param = useParams();
    const fetchData = async () => {
        const { success, data } = await getAllById(param.id);
        if (success && data.status != "Error") {
            setProduct(data.data);
            console.log(data.data);
        } else {
            toast.error(data.message);
        }
    };

    useEffect(() => {
        fetchData();

        console.log(product);
    }, []);
    return (
        <>
            <div class="container-fluid py-5 mt-5">
                <Link to={"/dashboard/product"}>
                    <Button type="primary">
                        <FontAwesomeIcon icon={faRightLeft} />
                    </Button>
                </Link>

                <div class="container py-5">
                    <div class="row g-4 mb-5">
                        <div class="col-lg-8 col-xl-9">
                            <div class="row g-4">
                                <div class="col-lg-6">
                                    <div class="border rounded">
                                        {product.listFileAndImage?.length >
                                        0 ? (
                                            <img
                                                src={
                                                    product.listFileAndImage[0]
                                                        ?.fileName
                                                }
                                                className="img-fluid rounded"
                                                alt="Image"
                                                style={{ width: "100%" }}
                                            />
                                        ) : (
                                            <img
                                                src={notImg}
                                                className="img-fluid rounded"
                                                alt="Image"
                                                style={{ width: "100%" }}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <h4 class="fw-bold mb-3">
                                        {product.productName}
                                    </h4>
                                    <p class="mb-3">
                                        Category: {product.branchName}
                                    </p>
                                    <h5 class="fw-bold mb-3">
                                        {product.prodcutPrice} đ
                                    </h5>
                                    <div class="d-flex mb-4">
                                        {/* <StarRating rate={product.rate} /> */}
                                        {/* <p class="mb-4">{product.ProductSold}</p> */}
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <nav>
                                        <div class="nav nav-tabs mb-3">
                                            <button
                                                class="nav-link active border-white border-bottom-0"
                                                type="button"
                                                role="tab"
                                                id="nav-about-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#nav-about"
                                                aria-controls="nav-about"
                                                aria-selected="true"
                                            >
                                                Description
                                            </button>
                                        </div>
                                    </nav>
                                    <div class="tab-content mb-5">
                                        <div
                                            class="tab-pane active"
                                            id="nav-about"
                                            role="tabpanel"
                                            aria-labelledby="nav-about-tab"
                                        >
                                            <p>{product.productDescription} </p>
                                            <p>
                                                Thương hiệu:{" "}
                                                {product.productOrigin}{" "}
                                            </p>
                                            <p class="mb-0">
                                                {product.productOrigin}
                                            </p>

                                            <div class="px-2">
                                                {/* <div class="row g-4">
                                                <div class="col-6">
                                                    <div class="row bg-light align-items-center text-center justify-content-center py-2">
                                                        <div class="col-6">
                                                            <p class="mb-0">Weight</p>
                                                        </div>
                                                        <div class="col-6">
                                                            <p class="mb-0">1 kg</p>
                                                        </div>
                                                    </div>
                                                    <div class="row text-center align-items-center justify-content-center py-2">
                                                        <div class="col-6">
                                                            <p class="mb-0">Country of Origin</p>
                                                        </div>
                                                        <div class="col-6">
                                                            <p class="mb-0">{product.productOrigin}</p>
                                                        </div>
                                                    </div>
                                                    <div class="row bg-light text-center align-items-center justify-content-center py-2">
                                                        <div class="col-6">
                                                            <p class="mb-0">Quality</p>
                                                        </div>
                                                        <div class="col-6">
                                                            <p class="mb-0">{product.productQuanlity}</p>
                                                        </div>
                                                    </div>
                                                    <div class="row text-center align-items-center justify-content-center py-2">
                                                        <div class="col-6">
                                                            <p class="mb-0">Сheck</p>
                                                        </div>
                                                        <div class="col-6">
                                                            <p class="mb-0">Healthy</p>
                                                        </div>
                                                    </div>
                                                  
                                                </div>
                                            </div> */}
                                            </div>
                                        </div>
                                        <div
                                            class="tab-pane"
                                            id="nav-mission"
                                            role="tabpanel"
                                            aria-labelledby="nav-mission-tab"
                                        >
                                            {/* <div class="d-flex">
                                            <img src="img/avatar.jpg" class="img-fluid rounded-circle p-3"  style={{width: "100px;", height: "100px;"}} alt="" />
                                            <div class="">
                                                <p class="mb-2" style={{fontSize: "14px"}}>April 12, 2024</p>
                                                <div class="d-flex justify-content-between">
                                                    <h5>Jason Smith</h5>
                                                    <div class="d-flex mb-3">
                                                        <i class="fa fa-star text-secondary"></i>
                                                        <i class="fa fa-star text-secondary"></i>
                                                        <i class="fa fa-star text-secondary"></i>
                                                        <i class="fa fa-star text-secondary"></i>
                                                        <i class="fa fa-star"></i>
                                                    </div>
                                                </div>
                                                <p>The generated Lorem Ipsum is therefore always free from repetition injected humour, or non-characteristic 
                                                    words etc. Susp endisse ultricies nisi vel quam suscipit </p>
                                            </div>
                                        </div> */}
                                            {/* <div class="d-flex">
                                            <img src="img/avatar.jpg" class="img-fluid rounded-circle p-3" style={{width: "100px;", height: "100px;"}} alt="" />
                                            <div class="">
                                                <p class="mb-2" style={{fontSize: "14px"}}>April 12, 2024</p>
                                                <div class="d-flex justify-content-between">
                                                    <h5>Sam Peters</h5>
                                                    <div class="d-flex mb-3">
                                                        <i class="fa fa-star text-secondary"></i>
                                                        <i class="fa fa-star text-secondary"></i>
                                                        <i class="fa fa-star text-secondary"></i>
                                                        <i class="fa fa-star"></i>
                                                        <i class="fa fa-star"></i>
                                                    </div>
                                                </div>
                                                <p class="text-dark">The generated Lorem Ipsum is therefore always free from repetition injected humour, or non-characteristic 
                                                    words etc. Susp endisse ultricies nisi vel quam suscipit </p>
                                            </div>
                                        </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Detail;
