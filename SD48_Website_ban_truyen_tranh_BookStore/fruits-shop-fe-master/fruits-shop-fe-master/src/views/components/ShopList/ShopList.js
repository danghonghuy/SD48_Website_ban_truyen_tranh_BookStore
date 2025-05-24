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
import useCategory from "@api/useCategory";
import { Col, Row } from "antd";
import { Form } from "antd";
import { Select } from "antd";
import { InputNumber } from "antd";
import useType from "api/useType";

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
  const [category, setCategory] = useState([]);
  const [types, setType] = useState([]);

  const [activeItem, setActiveItem] = useState(null);
  const { getList } = useProduct(); // goi toi ham getAll ben file useProduct de lay tat ca san pham
  const { getBranch } = useBranch(); //su dung hook, lay ham getBranch ben useBranch tu ket qua tra ve cua ham useBranch va luu vao bien getBranch, ten bien phai giong ham ben useBranch

  const { getListCategory } = useCategory();
  const { getListType } = useType();
  const [product, setProduct] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      status: 1,
      categoryId: null,
      typeId: null,
      keySearch: "",
    },
  });
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    const params = {
      ...tableParams.pagination,
      pageIndex: currentPage,
    };
    const { success, data } = await getList(params);
    if (!success || data.status == "Error") {
      toast.error("Có lỗi xảy ra");
    } else {
      setProduct(data.data);
      setLoading(false);
      setTotal(data.totalCount);
      setTotalPage(Math.ceil(data.totalCount / data.pageSize));
    }
  };

  const fetchCategory = async () => {
    const { success, data } = await getListCategory({
      pageIndex: 1,
      pageSize: 20,
      keySearch: "",
      status: 1,
    });
    if (!data.success) {
      toast.error("Có lỗi xảy ra");
    } else {
      var dataResults = data.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setCategory(dataResults);
      setLoading(false);
      setTotal(data.totalCount);
    }
  };

  const fetchType = async () => {
    const { success, data } = await getListType({
      pageIndex: 1,
      pageSize: 20,
      status: 1,
    });
    if (data.success) {
      var dataResults = data.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setType(dataResults);
    }
  };
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
    const { success, data } = await getListCategory({
      pageIndex: 1,
      pageSize: 5,
      keySearch: "",
      status: 1,
    });
    if (success) {
      setBranch(data.data); //set trang thai cho branch, da co du lieu cho branchProduct de hien thi ten cac danh muc
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
        keySearch: e.target.value,
      },
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
        categoryId: v,
      },
    }));
  };
  const handleSelectCategory = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        pageIndex: 1,
        categoryId: e,
      },
    }));
  };

  const handleSeletecType = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        pageIndex: 1,
        typeId: e,
      },
    }));
  };

  const onSearchMinValue = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        pageIndex: 1,
        minPrice: e,
      },
    }));
  };

  const onSearchMaxValue = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        pageIndex: 1,
        maxPrice: e,
      },
    }));
  };
  useEffect(() => {
    fetchData();
    fetchCategory();
    fetchType();
    fetchBranch();
  }, [
    JSON.stringify(tableParams),
    branchName,
    nameSearch,
    currentPage,
    sortValue,
    rangeValue,
  ]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      <div class="container-fluid fruite py-5">
        <div class="container">
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
                      onChange={(e) => hanleChangeNameSearch(e)}
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
                <div class="col-xl-6"></div>
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
                      <option value="DES">Giá giảm dần</option>
                      <option value="ASC">Giá tăng dần</option>
                    </select>
                  </div>
                </div>
              </div>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Form.Item label="Loại sản phẩm" name="categoryId">
                    <Select
                      placeholder="Please select"
                      value={tableParams.pagination.categoryId}
                      onChange={handleSelectCategory}
                      style={{
                        width: "100%",
                        height: "40px",
                      }}
                      options={category}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Gói bán SP" name="typeId">
                    <Select
                      placeholder="Please select"
                      value={tableParams.pagination.typeId}
                      onChange={handleSeletecType}
                      style={{
                        width: "100%",
                        height: "40px",
                      }}
                      options={types}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Giá từ" name="minPrice">
                    <InputNumber
                      style={{ height: "40px", width: "100%" }}
                      type="number"
                      min={0}
                      onChange={onSearchMinValue}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Đến" name="maxPrice">
                    <InputNumber
                      style={{ height: "40px", width: "100%" }}
                      type="number"
                      min={0}
                      onChange={onSearchMaxValue}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div class="col-12 col-xl-12">
                {/* <nav class="navbar navbar-expand-sm bg-light navbar-light"> */}
                <ul
                  id="lst-product"
                  class="navbar-nav"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
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
                      onClick={() => hanleGetByBranch(null)}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <div>Tất cả sản phẩm</div>
                    </div>
                  </li>

                  {branchProduct &&
                    branchProduct.map((items, key) => {
                      return (
                        <li
                          id="item-product"
                          key={items.id}
                          className={classNames({
                            activeItem:
                              activeItem === items.id && activeItem != null,
                          })}
                        >
                          <div
                            class="d-flex justify-content-between fruite-name"
                            onClick={() => hanleGetByBranch(items.id)}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <div>{items.name}</div>
                            {/* <span>({items.countProduct})</span> */}
                          </div>
                        </li>
                      );
                    })}
                </ul>
                {/* </nav> */}
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
                            transform: "translateY(-50%)",
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
                    {product &&
                      product.map((fruitt, index) => {
                        return (
                          <CardItem
                            imgSrc={fruitt.images && fruitt.images[0]?.imageUrl}
                            key={fruitt.id}
                            id={fruitt.id}
                            name={fruitt.name}
                            description={fruitt.description}
                            price={fruitt.price}
                            discount={
                              fruitt.discountDTO &&
                              (fruitt.discountDTO.percent
                                ? (fruitt.price * fruitt.discountDTO.percent) /
                                  100
                                : fruitt.discountDTO.moneyDiscount)
                            }
                            stock={fruitt.stock}
                          />
                        );
                      })}

                    <div className="col-12">
                      <div className="pagination d-flex justify-content-center mt-5">
                        <button
                          className="rounded"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          «
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                          <button
                            key={index}
                            className={
                              currentPage === index + 1
                                ? "active rounded"
                                : "rounded"
                            }
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </button>
                        ))}
                        <button
                          className="rounded"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          »
                        </button>
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
