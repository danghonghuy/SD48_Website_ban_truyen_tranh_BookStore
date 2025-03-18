import useBranch from "@api/useBranch";
import useProduct from "@api/useProduct";
import StarRating from "@components/Rate/StarRating";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
// import banner from '../../../assets/img/banner-fruits.jpg'
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";

import fruit from "../../../assets/img/fruite-item-6.jpg";
import useComment from "@api/useComment";
import { format, parseISO } from "date-fns";
import {
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBRow,
    MDBTypography,
} from "mdb-react-ui-kit";
import { useDispatch } from "react-redux";

import {
    addProductToCart,
    decreaseQuantity,
    increaseQuantity,
} from "../../../../src/services/redux/cartSlice/productSlice.js";

import useUser from "@store/useUser";

import { Link } from "react-router-dom";

function ProductDetail(id) {
    //them bien id

    const formatDateToDDMMYYYY = (dateString) => {
        const date = parseISO(dateString);
        return format(date, "dd/MM/yyyy");
    };

    const params = useParams();
    const { getAllById } = useProduct();
    const { getBranch } = useBranch();
    const dispatch = useDispatch();
    const { getCommentByProduct, addComment } = useComment();
    const [productDetail, setProductDetail] = useState({});
    const [branchProduct, setBranch] = useState([]);
    const [comments, setComments] = useState([]);
    const [post, setPost] = useState({
        userPost: "",
        email: "",
        comment: "",
    });

    const [count, setCount] = useState(1);

    const fetchData = async (id) => {
        const { success, data } = await getAllById(id);
        if (data.status != "Error" && success) {
            console.log(data.data);
            setProductDetail(data.data);
        } else {
            toast.error(data.message);
        }
    };
    const fetchDataComments = async () => {
        const { success, data } = await getCommentByProduct({
            ProductID: params.id,
        });
        if (data.status != "Error" && success) {
            setComments(data.data);
        } else {
            toast.error(data.message);
        }
    };

    const fetchBranch = async () => {
        const { success, data } = await getBranch({
            BranchName: "",
        });
        if (success && data.status != "Error") {
            setBranch(data.data.items);
        } else {
            toast.error(data.message);
        }
    };

    const handleAddComment = async () => {
        try {
            const { success, data } = await addComment({
                ProductId: params.id,
                ...post,
            });
            if (success) {
                // toast.success(data.message)
                setTimeout(() => {
                    fetchDataComments(params.id);
                    setPost({
                        userPost: "",
                        email: "",
                        comment: "",
                    });
                }, 1000);
            } else {
                toast.error(data != undefined ? data.message : "Server error");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleAddToCart = () => {
        dispatch(
            addProductToCart({
                id: params.id,
                imgSrc:
                    productDetail.listFileAndImage != undefined
                        ? productDetail.listFileAndImage[0]?.fileName
                        : fruit,
                name: productDetail.productName,
                price: productDetail.prodcutPrice,
                count: count,
            }),
        );
    };

    const handleIncreamentQuality = () => {
        dispatch(
            increaseQuantity({
                id: params.id,
                imgSrc:
                    productDetail.listFileAndImage != undefined
                        ? productDetail.listFileAndImage[0]?.fileName
                        : fruit,
                name: productDetail.productName,
                price: productDetail.prodcutPrice,
                count: count,
            }),
        );
    };

    const handleDecreamentQuality = () => {
        dispatch(
            decreaseQuantity({
                id: params.id,
                imgSrc:
                    productDetail.listFileAndImage != undefined
                        ? productDetail.listFileAndImage[0]?.fileName
                        : fruit,
                name: productDetail.productName,
                price: productDetail.prodcutPrice,
                count: count,
            }),
        );
    };

    useEffect(() => {
        fetchData(params.id);
        fetchDataComments(params.id);
        fetchBranch();

        console.log(productDetail);
    }, []);

    const t = useUser();
    return (
        <>
            <div class="container-fluid page-header py-5">
                <h1 class="text-center text-white display-6">Product Detail</h1>
                <ol class="breadcrumb justify-content-center mb-0">
                    <li class="breadcrumb-item">
                        <a href="/">Home</a>
                    </li>
                    {/* <li class="breadcrumb-item"><a href="#">Pages</a></li> */}
                    <li class="breadcrumb-item active text-white">
                        Shop Detail
                    </li>
                </ol>
            </div>

            <div class="container-fluid py-5 mt-5">
                <div class="container py-5">
                    <div class="row g-4 mb-5">
                        <div class="col-lg-8 col-xl-9">
                            <div class="row g-4">
                                <div class="col-lg-6">
                                    <div class="border rounded">
                                        <a href="#">
                                            <img
                                                src={
                                                    productDetail.listFileAndImage !=
                                                    undefined
                                                        ? productDetail
                                                              .listFileAndImage[0]
                                                              ?.fileName
                                                        : fruit
                                                }
                                                class="img-fluid rounded"
                                                alt="Image"
                                            />
                                        </a>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <h4 class="fw-bold mb-3">
                                        {productDetail.productName}
                                    </h4>
                                    <p class="mb-3">
                                        Danh mục: {productDetail.branchName}
                                    </p>
                                    <h5 class="fw-bold mb-3">
                                        {productDetail.prodcutPrice} đ
                                    </h5>
                                    <div class="d-flex mb-4">
                                        {/* <StarRating rate={productDetail.rate} /> */}
                                    </div>
                                    {/* <p class="mb-4">{productDetail.productDescription}</p> */}
                                    <div
                                        class="input-group quantity mb-5"
                                        style={{ width: "100px" }}
                                    >
                                        <div class="input-group-btn">
                                            <button
                                                onClick={() => {
                                                    if (count <= 2) {
                                                        setCount(1);
                                                    } else {
                                                        setCount(count - 1);
                                                    }

                                                    handleDecreamentQuality();
                                                }}
                                                class="btn btn-sm btn-minus rounded-circle bg-light border"
                                            >
                                                <i class="fa fa-minus"></i>
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            class="form-control form-control-sm text-center border-0"
                                            value={count}
                                        />
                                        <div class="input-group-btn">
                                            <button
                                                onClick={() => {
                                                    setCount(count + 1);
                                                    handleIncreamentQuality();
                                                }}
                                                class="btn btn-sm btn-plus rounded-circle bg-light border"
                                            >
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <a
                                        href="javascript:void(0)"
                                        onClick={handleAddToCart}
                                        class="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"
                                    >
                                        <i class="fa fa-shopping-bag me-2 text-primary"></i>{" "}
                                        Add to cart
                                    </a>
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
                                            <button
                                                class="nav-link border-white border-bottom-0"
                                                type="button"
                                                role="tab"
                                                id="nav-mission-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#nav-mission"
                                                aria-controls="nav-mission"
                                                aria-selected="false"
                                            >
                                                Reviews
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
                                            <p>
                                                Mô tả:
                                                {
                                                    productDetail.productDescription
                                                }{" "}
                                            </p>
                                            <p>
                                                Số lượng :{" "}
                                                {productDetail.countProduct}{" "}
                                            </p>
                                            <p>
                                                Xuất xứ :
                                                {productDetail.originName}{" "}
                                            </p>

                                            {/* <div class="px-2">
                                            <div class="row g-4">
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
                                                            <p class="mb-0">{productDetail.productOrigin}</p>
                                                        </div>
                                                    </div>
                                                    <div class="row bg-light text-center align-items-center justify-content-center py-2">
                                                        <div class="col-6">
                                                            <p class="mb-0">Quality</p>
                                                        </div>
                                                        <div class="col-6">
                                                            <p class="mb-0">{productDetail.productQuanlity}</p>
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
                                            </div>
                                        </div> */}
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
                                            <div class="d-flex">
                                                {/* <img src="img/avatar.jpg" class="img-fluid rounded-circle p-3" style={{width: "100px;", height: "100px;"}} alt="" /> */}
                                                {/* <div class="">
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

                                            </div> */}
                                                {/* className="py-5"  */}

                                                <MDBContainer
                                                    style={{
                                                        marginLeft: "-24px",
                                                        color: "red",
                                                        maxWidth: "100%",
                                                        padding:
                                                            "0px !important",
                                                    }}
                                                >
                                                    <MDBRow className="justify-content-start">
                                                        <MDBCol md="12" lg="10">
                                                            <MDBCard className="text-dark">
                                                                {/* <MDBTypography tag="h4" className="mb-0 pd-5">
                                                    Recent comments
                                                </MDBTypography> */}
                                                                {/* <p className="fw-light mb-4 pb-2">
                                                    Latest Comments section by users
                                                </p> */}
                                                                {comments.length >
                                                                    0 &&
                                                                    comments.map(
                                                                        (
                                                                            item,
                                                                        ) => (
                                                                            <>
                                                                                <MDBCardBody className="p-4">
                                                                                    {/* <div className="d-flex flex-start">
                                                                    <div> */}
                                                                                    <MDBTypography
                                                                                        tag="h6"
                                                                                        className="fw-bold mb-1"
                                                                                    >
                                                                                        {formatDateToDDMMYYYY(
                                                                                            item.createAt,
                                                                                        )}
                                                                                    </MDBTypography>
                                                                                    {/* <div className="d-flex align-items-center mb-3 "style={{margin:"0px !important"}}> */}
                                                                                    <h5
                                                                                        className="mb-0"
                                                                                        style={{
                                                                                            margin: "0px !important",
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            item.userPost
                                                                                        }
                                                                                    </h5>
                                                                                    {/* </div> */}
                                                                                    <p className="mb-0">
                                                                                        {
                                                                                            item.comment
                                                                                        }
                                                                                    </p>
                                                                                    {/* </div>
                                                            </div> */}
                                                                                </MDBCardBody>
                                                                                <hr className="my-0" />
                                                                            </>
                                                                        ),
                                                                    )}
                                                            </MDBCard>
                                                        </MDBCol>
                                                    </MDBRow>
                                                </MDBContainer>
                                            </div>
                                            <form action="#">
                                                <h4 class="mb-5 fw-bold">
                                                    Leave a Reply
                                                </h4>
                                                <div class="row g-4">
                                                    <div class="col-lg-6">
                                                        <div class="border-bottom rounded ">
                                                            <input
                                                                type="text"
                                                                name="userPost"
                                                                onChange={(
                                                                    r,
                                                                ) => {
                                                                    setPost({
                                                                        userPost:
                                                                            r
                                                                                .target
                                                                                .value,
                                                                        email: post.email,
                                                                        comment:
                                                                            post.comment,
                                                                    });
                                                                }}
                                                                value={
                                                                    post.userPost
                                                                }
                                                                class="form-control border-0 me-4"
                                                                placeholder="Yur Name *"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-6">
                                                        <div class="border-bottom rounded">
                                                            <input
                                                                type="email"
                                                                onChange={(
                                                                    r,
                                                                ) => {
                                                                    setPost({
                                                                        userPost:
                                                                            post.userPost,
                                                                        email: r
                                                                            .target
                                                                            .value,
                                                                        comment:
                                                                            post.comment,
                                                                    });
                                                                }}
                                                                value={
                                                                    post.email
                                                                }
                                                                class="form-control border-0"
                                                                placeholder="Your Email *"
                                                                required="true"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-12">
                                                        <div class="border-bottom rounded my-4">
                                                            <textarea
                                                                name="comment"
                                                                id=""
                                                                onChange={(
                                                                    r,
                                                                ) => {
                                                                    setPost({
                                                                        userPost:
                                                                            post.userPost,
                                                                        email: post.email,
                                                                        comment:
                                                                            r
                                                                                .target
                                                                                .value,
                                                                    });
                                                                }}
                                                                value={
                                                                    post.comment
                                                                }
                                                                class="form-control border-0"
                                                                cols="30"
                                                                rows="8"
                                                                placeholder="Your Review *"
                                                                spellcheck="false"
                                                            ></textarea>
                                                        </div>
                                                    </div>

                                                    {/* <div class="col-lg-12">
                                        <div class="d-flex justify-content-between py-3 mb-5">
                
                                            <a href="javascript:void(0)" onClick={() => {
                                                  handleAddComment()
                                            }} class="btn border border-secondary text-primary rounded-pill px-4 py-3"> Post Comment</a>
                                        </div>
                                    </div> */}
                                                    {/* {t.username ? ( 
                                                <Link to="/product/${id}">
                                            
                                                   <a href="javascript:void(0)" onClick={() => {
                                                     handleAddComment()
                                                    }} class="btn border border-secondary text-primary rounded-pill px-4 py-3"> Post Comment</a>
             
                                                </Link>
                                                ) : (
                                               <Link to="/login">
                                                          <a href="javascript:void(0)" onClick={() => {
                                                  handleAddComment()
                                               }} class="btn border border-secondary text-primary rounded-pill px-4 py-3"> Post Comment</a>
                                                </Link>
                                            )}
 */}

                                                    {/* <div class="col-lg-12">
                                        <div class="d-flex justify-content-between py-3 mb-5">
                                            <div class="d-flex align-items-center">
                                                <p class="mb-0 me-3">Please rate:</p>
                                                <div class="d-flex align-items-center" style={{fontSize: "12px"}}>
                                                    <i class="fa fa-star text-muted"></i>
                                                    <i class="fa fa-star"></i>
                                                    <i class="fa fa-star"></i>
                                                    <i class="fa fa-star"></i>
                                                    <i class="fa fa-star"></i>
                                                </div>
                                            </div>


                                            {t.username ? ( 
                                                <Link to="/product/${id}">
                                            
                                                   <a href="javascript:void(0)" onClick={() => {
                                                     handleAddComment()
                                                    }} class="btn border border-secondary text-primary rounded-pill px-4 py-3"> Post Comment</a>
             
                                                </Link>
                                                ) : (
                                               <Link to="/login">
                                                          <a href="javascript:void(0)" onClick={() => {
                                                  handleAddComment()
                                               }} class="btn border border-secondary text-primary rounded-pill px-4 py-3"> Post Comment</a>
                                                </Link>
                                            )}
                                       
                                        </div>
                                    </div> */}
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                {/* <form action="#">
                                <h4 class="mb-5 fw-bold">Leave a Reply</h4>
                                <div class="row g-4">
                                    <div class="col-lg-6">
                                        <div class="border-bottom rounded ">
                                            <input type="text" name="userPost" onChange={(r) => {
                                                setPost({
                                                    userPost: r.target.value,
                                                    email: post.email,
                                                    comment: post.comment
                                                })
                                            }} value={post.userPost} class="form-control border-0 me-4" placeholder="Yur Name *" />
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="border-bottom rounded">
                                            <input type="email" onChange={(r) => {
                                                setPost({
                                                    userPost: post.userPost,
                                                    email: r.target.value,
                                                    comment: post.comment
                                                })
                                             }} value={post.email} class="form-control border-0" placeholder="Your Email *" />
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="border-bottom rounded my-4">
                                            <textarea name="comment" id="" onChange={(r) => {
                                                setPost({
                                                    userPost: post.userPost,
                                                    email: post.email,
                                                    comment: r.target.value
                                                })
                                             }}  value={post.comment}  class="form-control border-0" cols="30" rows="8" placeholder="Your Review *" spellcheck="false"></textarea>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="d-flex justify-content-between py-3 mb-5">
                                            <div class="d-flex align-items-center">
                                                <p class="mb-0 me-3">Please rate:</p>
                                                <div class="d-flex align-items-center" style={{fontSize: "12px"}}>
                                                    <i class="fa fa-star text-muted"></i>
                                                    <i class="fa fa-star"></i>
                                                    <i class="fa fa-star"></i>
                                                    <i class="fa fa-star"></i>
                                                    <i class="fa fa-star"></i>
                                                </div>
                                            </div>
                                            <a href="javascript:void(0)" onClick={() => {
                                                  handleAddComment()
                                            }} class="btn border border-secondary text-primary rounded-pill px-4 py-3"> Post Comment</a>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <div class="d-flex justify-content-between py-3 mb-5">
                                            <div class="d-flex align-items-center">
                                                <p class="mb-0 me-3">Please rate:</p>
                                                <div class="d-flex align-items-center" style={{fontSize: "12px"}}>
                                                    <i class="fa fa-star text-muted"></i>
                                                    <i class="fa fa-star"></i>
                                                    <i class="fa fa-star"></i>
                                                    <i class="fa fa-star"></i>
                                                    <i class="fa fa-star"></i>
                                                </div>
                                            </div>


                                            {t.username ? ( //dung de dang nhạp moi duoc cmt
                                                <Link to="/product/${id}">
                                            
                                                   <a href="javascript:void(0)" onClick={() => {
                                                     handleAddComment()
                                                    }} class="btn border border-secondary text-primary rounded-pill px-4 py-3"> Post Comment</a>
             
                                                </Link>
                                                ) : (
                                               <Link to="/login">
                                                          <a href="javascript:void(0)" onClick={() => {
                                                  handleAddComment()
                                               }} class="btn border border-secondary text-primary rounded-pill px-4 py-3"> Post Comment</a>
                                                </Link>
                                            )}
                                       
                                        </div>
                                    </div>
                                </div>
                            </form> */}

                                {/* hien thi comment ben duoi */}
                                {/* <section>
                                        <MDBContainer className="py-5" style={{ maxWidth: "100%" }}>
                                            <MDBRow className="justify-content-center">
                                            <MDBCol md="12" lg="10">
                                                <MDBCard className="text-dark">
                                                <MDBTypography tag="h4" className="mb-0 pd-5">
                                                    Recent comments
                                                    </MDBTypography>
                                                    <p className="fw-light mb-4 pb-2">
                                                    Latest Comments section by users
                                                    </p>
                                                {
                                                    comments.length > 0 && comments.map(item => (
                                                        <>
                                                            <MDBCardBody className="p-4">
                                                            <div className="d-flex flex-start">
                                                                <div>
                                                                    <MDBTypography tag="h6" className="fw-bold mb-1">
                                                                    {item.userPost}
                                                                    </MDBTypography>
                                                                    <div className="d-flex align-items-center mb-3">
                                                                    <p className="mb-0">
                                                                        {formatDateToDDMMYYYY(item.createAt)}
                                                                    </p>
                                                                    </div>
                                                                    <p className="mb-0">
                                                                        {item.comment}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            </MDBCardBody>
                                                            <hr className="my-0" />
                                                        </>
                                                    ))
                                                }
                                                </MDBCard>
                                            </MDBCol>
                                            </MDBRow>
                                        </MDBContainer>
                                </section> */}
                            </div>
                        </div>

                        <div class="col-lg-4 col-xl-3">
                            <div class="row g-4 fruite">
                                <div class="col-lg-12">
                                    {/* <div class="input-group w-100 mx-auto d-flex mb-4">
                                    <input type="search" class="form-control p-3" placeholder="keywords" aria-describedby="search-icon-1" />
                                    <span id="search-icon-1" class="input-group-text p-3"><i class="fa fa-search"></i></span>
                                </div> */}
                                    <div class="mb-4">
                                        <h4>Danh mục</h4>
                                        <ul class="list-unstyled fruite-categorie">
                                            {branchProduct.map((items, key) => {
                                                return (
                                                    <li key={items.id}>
                                                        <div class="d-flex justify-content-between fruite-name">
                                                            <div>
                                                                <i class="fas fa-apple-alt me-2"></i>
                                                                {
                                                                    items.branchName
                                                                }
                                                            </div>
                                                            <span>
                                                                (
                                                                {
                                                                    items.countProduct
                                                                }
                                                                )
                                                            </span>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    {/* <h4 class="mb-4">Featured products</h4> */}

                                    {/* {dataProduct.slice(0,3).map((items,key) => {
                                    return (
                                    <div class="d-flex align-items-center justify-content-start" key={key}>
                                        <div
                                            class="rounded me-4"
                                            style={{ width: "100px", height: "100px" }}
                                        >
                                            <img
                                            src="img/featur-1.jpg"
                                            class="img-fluid rounded"
                                            alt=""
                                            />
                                        </div>
                                        <div>
                                            <h6 class="mb-2">{items.productName}</h6>
                                            <StarRating rate={items.rate} />
                                            <div class="d-flex mb-2">
                                            <h5 class="fw-bold me-2">{items.prodcutPrice} $</h5>
                                            </div>
                                        </div>
                                        </div>
                                    )
                                })}
                      */}
                                </div>
                                {/* <div class="col-lg-12">
                                <div class="position-relative">
                                    <img src={banner}class="img-fluid w-100 rounded" alt="" />
                                    <div class="position-absolute" style={{top: "50%", right: "10px"}}>
                                        <h3 class="text-secondary fw-bold">Fresh <br /> Fruits <br /> Banner</h3>
                                    </div>
                                </div>
                            </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductDetail;
