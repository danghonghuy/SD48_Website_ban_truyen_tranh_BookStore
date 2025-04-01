import CardItem from "@components/CardItem/CardItem";
import PriceRangeInput from "@components/PriceRangeInput/PriceRangeInput";
import React, { useEffect, useState } from "react";
import useProduct from "@api/useProduct";
import { toast } from "react-toastify";
import useBranch from "@api/useBranch";
import "../../../css/style.css";
import StarRating from "@components/Rate/StarRating";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import useCategory from '@api/useCategory';

function formatCurrencyVND(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

const ShopList = () => {
    const [dataProduct, setData] = useState([]); //khoi tao trang thai dataProduct la mang rong và cung cấp setData để cập nhat trang thai nay
    const [branchProduct, setBranch] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPage] = useState(0);
    const [branchName, setBranchSearch] = useState(null); //khi handlegetbybranch thi se lay duoc branchName, branchName da co du lieu
    const [rangeValue, setRangeValue] = useState(0);
    const [nameSearch, setNameSearch] = useState(null);
    const [sortValue, setSortValue] = useState();
    const [color, setColor] = useState("blue");

    const [activeItem, setActiveItem] = useState(null);
    const { getList } = useProduct(); // goi toi ham getAll ben file useProduct de lay tat ca san pham
    const { getBranch } = useBranch(); //su dung hook, lay ham getBranch ben useBranch tu ket qua tra ve cua ham useBranch va luu vao bien getBranch, ten bien phai giong ham ben useBranch

    const { getListCategory } = useCategory();
    const [product, setProduct] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            status: null,
            categoryId: null,
            typeId: null,
            keySearch: ''
        },
    });
    const [total, setTotal] = useState();
 const [loading, setLoading] = useState(false);
    const fetchData = async () => {
        const { success, data } = await getList(tableParams.pagination);
        if (!success || data.status == 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            setProduct(data.data)
            setLoading(false);
            setTotal(data.totalCount)
        }
    };

    const fetchCategory = async () => {
        const { success, data } = await getListCategory({
            pageIndex: 1,
            pageSize: 10,
            keySearch: "",
            status: 1
        });
        if (!success || data.status == 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            setBranch(data.data)
            setLoading(false);
            setTotal(data.totalCount)
        }
    }
    // const fetchProduct = async () => {
    //     //lay san pham tu server
    //     const { success, data } = await getAll({
    //         //duoc goi voi cac tham so ben duoi
    //         pageIndex: currentPage,
    //         pageSize: 16,
    //         ProductName: nameSearch,
    //         BranchId: branchName,
    //         SortBy: sortValue,
    //     });

    //     if (success && data.status != "Error") {
    //         setData(data.data.items);
    //         setTotalPage(data.data.totalPage);
    //     } else {
    //         toast.error(data.data.message);
    //     }
    // };
    const handleSort = (e) => {
        setSortValue(e.target.value);
    };

    const fetchBranch = async () => {
        ///lay danh sach cac danh muc tu serve
        const { success, data } = await getBranch({
            BranchName: "",
        });
        if (success && data.status != "Error") {
            setBranch(data.data.items); //set trang thai cho branch, da co du lieu cho branchProduct de hien thi ten cac danh muc
        } else {
            toast.error(data.message);
        }
    };

    const hanleChangeNameSearch = (e) => {
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                pageIndex: 1,
                keySearch: e.target.value
            }
        }));
    };
    const handleSearch = () => {
        // fetchProduct();
    };
    const hanleGetByBranch = (v) => {
        setBranchSearch(v);
        setActiveItem(v);
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                pageIndex: 1,
                categoryId: v
            }
        }));
    };
    useEffect(() => {
        fetchData();
        fetchCategory();
        // fetchBranch();
    }, [JSON.stringify(tableParams) ,branchName, nameSearch, currentPage, sortValue, rangeValue]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <>
            <div class="container-fluid fruite py-5">
                <div class="container py-5">
                    <h1 class="mb-4">Fresh fruits shop</h1>
                    <div class="row g-4">
                        <div class="col-lg-12">
                            <div class="row g-4">
                                <div class="col-xl-3">
                                    <div class="input-group w-100 mx-auto d-flex">
                                        <input
                                            type="search"
                                            class="form-control p-3"
                                            placeholder="Tìm kiếm"
                                            aria-describedby="search-icon-1"
                                            onChange={(e) =>
                                                hanleChangeNameSearch(e)
                                            }
                                        />
                                        <span
                                            id="search-icon-1"
                                            class="input-group-text p-3"
                                            style={{ cursor: "pointer" }}
                                            onClick={handleSearch}
                                        >
                                            <i class="fa fa-search"></i>
                                        </span>
                                    </div>
                                </div>

                                <div class="col-6 col-xl-">
                                    {/* <nav class="navbar navbar-expand-sm bg-light navbar-light"> */}
                                    <ul
                                        id="lst-product"
                                        class="navbar-nav"
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <li
                                            id="item-product"
                                            key={""}
                                            className={classNames({
                                                activeItem: activeItem === null,
                                            })}
                                        >
                                            <div
                                                class="d-flex justify-content-between fruite-name"
                                                onClick={() =>
                                                    hanleGetByBranch(null)
                                                }   
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <div>Tất cả sản phẩm</div>
                                            </div>
                                        </li>

                                        {branchProduct && branchProduct.map((items, key) => {
                                            return (
                                                <li
                                                    id="item-product"
                                                    key={items.id}
                                                    className={classNames({
                                                        activeItem:
                                                            activeItem ===
                                                            items.id &&
                                                            activeItem != null,
                                                    })}
                                                >
                                                    <div
                                                        class="d-flex justify-content-between fruite-name"
                                                        onClick={() =>
                                                            hanleGetByBranch(
                                                                items.id,
                                                            )
                                                        }
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <div>
                                                            {items.name}
                                                        </div>
                                                        {/* <span>({items.countProduct})</span> */}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    {/* </nav> */}
                                </div>

                                <div class="col-xl-3">
                                    <div class="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4">
                                        <label for="fruits">Sắp xếp:</label>
                                        <select
                                            id="fruits"
                                            name="fruitlist"
                                            class="border-0 form-select-sm bg-light me-3"
                                            form="fruitform"
                                            onChange={(e) => {
                                                handleSort(e);
                                            }}
                                        >
                                            <option value="DES">
                                                Giá giảm dần
                                            </option>
                                            <option value="ASC">
                                                Giá tăng dần
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-4">
                                <div class="col-lg-3">
                                    <div class="row g-4">
                                        <div class="col-lg-12">
                                            <div class="mb-3">
                                                {/* <h4>Danh mục</h4> */}
                                                {/* <ul class="list-unstyled fruite-categorie">
                          {
                            branchProduct.map((items,key) => {
                              return (
                              <li key={items.id} >
                                <div class="d-flex justify-content-between fruite-name" onClick={() => hanleGetByBranch(items.id)} style={{cursor: 'pointer'}}>
                                  <div>
                                    <i class="fas fa-apple-alt me-2" ></i>{items.branchName}
                                  </div>
                                  <span>({items.countProduct})</span>
                                </div> 
                              </li>
                              )
                            })
                          }
                        </ul> */}
                                            </div>
                                        </div>
                                        {/* <div class="col-lg-12">
                      <PriceRangeInput data={rangeValue} fnc={(v) => setRangeValue(v)} />
                    </div> */}

                                        <div class="col-lg-12">
                                            {/* <h4 class="mb-3">Sản phẩm nổi bật</h4> */}
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="position-relative">
                                                {/* <img
                          src="img/banner-fruits.jpg"
                          class="img-fluid w-100 rounded"
                          alt=""
                        /> */}
                                                <div
                                                    class="position-absolute"
                                                    style={{
                                                        top: "50%",
                                                        right: "10px",
                                                        transform:
                                                            "translateY(-50%)",
                                                    }}
                                                >
                                                    {/* <h3 class="text-secondary fw-bold">
                            Fresh <br /> Fruits <br /> Banner
                          </h3> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* hien thi san pham */}

                                <div class="col-lg-12">
                                    <div class="row g-4 justify-content-center">
                                        {product && product.map((fruitt, index) => {
                                            return (
                                                <CardItem
                                                    imgSrc={
                                                        fruitt.images &&  fruitt.images[0]
                                                    }
                                                    key={fruitt.id}
                                                    id={fruitt.id}
                                                    name={fruitt.name}
                                                    description={
                                                        fruitt.description
                                                    }
                                                    price={fruitt.price}
                                                />
                                            );
                                        })}

                                        <div className="col-12">
                                            <div className="pagination d-flex justify-content-center mt-5">
                                                <a
                                                    href="#"
                                                    className="rounded"
                                                    onClick={() =>
                                                        handlePageChange(
                                                            currentPage - 1,
                                                        )
                                                    }
                                                    disabled={currentPage === 1}
                                                >
                                                    «
                                                </a>
                                                {Array.from(
                                                    { length: totalPages },
                                                    (_, index) => (
                                                        <a
                                                            key={index}
                                                            href="#"
                                                            className={
                                                                currentPage ===
                                                                    index + 1
                                                                    ? "active rounded"
                                                                    : "rounded"
                                                            }
                                                            onClick={() =>
                                                                handlePageChange(
                                                                    index + 1,
                                                                )
                                                            }
                                                        >
                                                            {index + 1}
                                                        </a>
                                                    ),
                                                )}
                                                <a
                                                    href="#"
                                                    className="rounded"
                                                    onClick={() =>
                                                        handlePageChange(
                                                            currentPage + 1,
                                                        )
                                                    }
                                                    disabled={
                                                        currentPage ===
                                                        totalPages
                                                    }
                                                >
                                                    »
                                                </a>
                                            </div>
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
};

export default ShopList;
