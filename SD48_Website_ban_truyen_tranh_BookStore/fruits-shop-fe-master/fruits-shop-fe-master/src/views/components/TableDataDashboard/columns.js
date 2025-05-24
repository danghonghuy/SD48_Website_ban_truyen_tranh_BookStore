import React from "react";
import { Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DeleteProduct from "../deleteProductDasboard/DeleteProduct";
import EditProduct from "../edirProductDashboard/EditProduct";

const columns = [
  {
    title: "Branch",
    dataIndex: "brandName",
    key: "branchId",
  },
  {
    title: "Category",
    dataIndex: "CategoryId",
    key: "categoryId",
  },
  {
    title: "Origin",
    dataIndex: "originName",
    key: "originId",
  },
  {
    title: "Name",
    dataIndex: "ProductName",
    key: "productName",
    
  },
  {
    title: "Price",
    dataIndex: "ProductPrice",
    key: "productPrice",
  },
  {
    title: "Quantity",
    dataIndex: "ProductQuantity",
    key: "productQuantity",
  },
  {
    title: "Description",
    dataIndex: "ProductDescription",
    key: "productDescription",
  },
  {
    title: "Material",
    dataIndex: "ProductMaterial",
    key: "productMaterial",
  },
  {
    title: "Views",
    dataIndex: "Views",
    key: "views",
  },
  {
    title: "Rate",
    dataIndex: "Rate",
    key: "rate",
  },
  {
    title: "Type",
    dataIndex: "ProductType",
    key: "productType",
  },
  {
    title: "Img",
    dataIndex: "ListFileImg",
    key: "listFileImg",
    render: (listFileImg) => (
      <ul>
        {listFileImg.map((file, index) => (
          <li key={index}>{file}</li>
        ))}
      </ul>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <span style={{ display: "flex", gap: "10px" }}>
        <EditProduct record={record} />

        <DeleteProduct record={record} />
      </span>
    ),
  },
];

export default columns;
