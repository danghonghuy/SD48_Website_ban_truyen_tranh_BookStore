import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Select,
  Button,
  DatePicker,
  Form,
  Table,
  Statistic,
  Space,
  Empty,
} from "antd";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import useDashboard from "@api/useDashboard";
import { formatCurrencyVND } from "@constants/commonFunctions";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
import useProduct from "@api/useProduct";
// import { getMediaUrl } from "constants/commonFunctions"; // No longer needed as images are removed

const { Title, Text } = Typography;

const filters = [
  { label: "Hôm nay", value: "TODAY" },
  { label: "Tuần", value: "WEEK" },
  { label: "Tháng", value: "MONTH" },
  { label: "Năm", value: "YEAR" },
  { label: "Khoảng thời gian", value: "FT" },
];

const pieChartBaseOptions = {
  chart: {
    type: "pie",
    toolbar: { show: true },
  },
  labels: [
    "Thành công",
    "Hủy đơn",
    "Chờ xác nhận",
    "Xác nhận đơn",
    "Chờ vận chuyển",
    "Giao hàng thành công",
    "Thất bại",
  ],
  responsive: [
    {
      breakpoint: 768,
      options: {
        chart: {
          width: "100%",
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
        },
      },
    },
    {
      breakpoint: 480,
      options: {
        chart: {
          width: "100%",
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
        },
      },
    },
  ],
  legend: {
    position: "right",
    offsetY: 0,
    offsetX: -10,
    itemMargin: {
      vertical: 4,
    },
    fontSize: "13px",
    fontFamily: "inherit",
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    y: {
      formatter: function (value, { seriesIndex, w }) {
        // Robust check for w and its properties
        if (
          w &&
          w.globals &&
          w.globals.labels &&
          typeof w.globals.labels[seriesIndex] !== "undefined"
        ) {
          const label = w.globals.labels[seriesIndex];
          return `${label}: ${value.toFixed(0)} đơn`;
        }
        return `${value.toFixed(0)} đơn`; // Fallback if label is not found
      },
    },
    style: {
      fontSize: "13px",
      fontFamily: "inherit",
    },
  },
  plotOptions: {
    pie: {
      expandOnClick: true,
      donut: {
        size: "55%",
        labels: {
          show: false,
        },
      },
    },
  },
  colors: [
    "#00E396",
    "#FF4560",
    "#FEB019",
    "#008FFB",
    "#775DD0",
    "#3F51B5",
    "#F44336",
  ],
};

const dollorSVG = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.43338 7.41784C8.58818 7.31464 8.77939 7.2224 9 7.15101L9.00001 8.84899C8.77939 8.7776 8.58818 8.68536 8.43338 8.58216C8.06927 8.33942 8 8.1139 8 8C8 7.8861 8.06927 7.66058 8.43338 7.41784Z"
      fill="currentColor"
    ></path>
    <path
      d="M11 12.849L11 11.151C11.2206 11.2224 11.4118 11.3146 11.5666 11.4178C11.9308 11.6606 12 11.8861 12 12C12 12.1139 11.9308 12.3394 11.5666 12.5822C11.4118 12.6854 11.2206 12.7776 11 12.849Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM11 5C11 4.44772 10.5523 4 10 4C9.44772 4 9 4.44772 9 5V5.09199C8.3784 5.20873 7.80348 5.43407 7.32398 5.75374C6.6023 6.23485 6 7.00933 6 8C6 8.99067 6.6023 9.76515 7.32398 10.2463C7.80348 10.5659 8.37841 10.7913 9.00001 10.908L9.00002 12.8492C8.60902 12.7223 8.31917 12.5319 8.15667 12.3446C7.79471 11.9275 7.16313 11.8827 6.74599 12.2447C6.32885 12.6067 6.28411 13.2382 6.64607 13.6554C7.20855 14.3036 8.05956 14.7308 9 14.9076L9 15C8.99999 15.5523 9.44769 16 9.99998 16C10.5523 16 11 15.5523 11 15L11 14.908C11.6216 14.7913 12.1965 14.5659 12.676 14.2463C13.3977 13.7651 14 12.9907 14 12C14 11.0093 13.3977 10.2348 12.676 9.75373C12.1965 9.43407 11.6216 9.20873 11 9.09199L11 7.15075C11.391 7.27771 11.6808 7.4681 11.8434 7.65538C12.2053 8.07252 12.8369 8.11726 13.254 7.7553C13.6712 7.39335 13.7159 6.76176 13.354 6.34462C12.7915 5.69637 11.9405 5.26915 11 5.09236V5Z"
      fill="currentColor"
    ></path>
  </svg>
);
const cartSVG = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 2C7.79086 2 6 3.79086 6 6V7H5C4.49046 7 4.06239 7.38314 4.00612 7.88957L3.00612 16.8896C2.97471 17.1723 3.06518 17.455 3.25488 17.6669C3.44458 17.8789 3.71556 18 4 18H16C16.2844 18 16.5554 17.8789 16.7451 17.6669C16.9348 17.455 17.0253 17.1723 16.9939 16.8896L15.9939 7.88957C15.9376 7.38314 15.5096 7 15 7H14V6C14 3.79086 12.2091 2 10 2ZM12 7V6C12 4.89543 11.1046 4 10 4C8.89543 4 8 4.89543 8 6V7H12ZM6 10C6 9.44772 6.44772 9 7 9C7.55228 9 8 9.44772 8 10C8 10.5523 7.55228 11 7 11C6.44772 11 6 10.5523 6 10ZM13 9C12.4477 9 12 9.44772 12 10C12 10.5523 12.4477 11 13 11C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9Z"
      fill="currentColor"
    ></path>
  </svg>
);
const heartSVG = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.17157 5.17157C4.73367 3.60948 7.26633 3.60948 8.82843 5.17157L10 6.34315L11.1716 5.17157C12.7337 3.60948 15.2663 3.60948 16.8284 5.17157C18.3905 6.73367 18.3905 9.26633 16.8284 10.8284L10 17.6569L3.17157 10.8284C1.60948 9.26633 1.60948 6.73367 3.17157 5.17157Z"
      fill="currentColor"
    ></path>
  </svg>
);
const cancelledSVG = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM11.4142 10L13.7071 7.70711C14.0976 7.31658 14.0976 6.68342 13.7071 6.29289C13.3166 5.90237 12.6834 5.90237 12.2929 6.29289L10 8.58579L7.70711 6.29289C7.31658 5.90237 6.68342 5.90237 6.29289 6.29289C5.90237 6.68342 5.90237 7.31658 6.29289 7.70711L8.58579 10L6.29289 12.2929C5.90237 12.6834 5.90237 13.3166 6.29289 13.7071C6.68342 14.0976 7.31658 14.0976 7.70711 13.7071L10 11.4142L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L11.4142 10Z"
      fill="currentColor"
    ></path>
  </svg>
);

export default function SastisfyManager() {
  const [selectedFilter, setSelectedFilter] = useState(filters[0].value);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dataDashboard, setDataDashboard] = useState(null);
  const [dataDashboardPie, setDataDashboardPie] = useState([
    0, 0, 0, 0, 0, 0, 0,
  ]);
  const [bestSale, setBestSale] = useState([]);
  const [runningOut, setRunningOut] = useState([]);
  const [revenueLineData, setRevenueLineData] = useState({
    series: [{ name: "Doanh thu", data: [] }],
  });

  const { getBestSale, getRunningOut } = useProduct();
  const { getStatistical } = useDashboard();

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    if (value !== "FT") {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const fetchData = (filterType, dateRange = {}) => {
    getStatistical(filterType, dateRange).then((data) => {
      if (data.success && data.data) {
        setDataDashboard(data.data);
        setDataDashboardPie([
          data.data.totalSuccess || 0,
          data.data.totalCancel || 0,
          data.data.totalWaiting || 0,
          data.data.totalAccept || 0,
          data.data.totalDelivery || 0,
          data.data.totalFinishDelivery || 0,
          data.data.totalFail || 0,
        ]);

        if (data.data.revenueTrend && Array.isArray(data.data.revenueTrend)) {
          const sortedTrend = data.data.revenueTrend
            .map((item) => ({
              x: dayjs(item.date).valueOf(),
              y: item.revenue,
            }))
            .sort((a, b) => a.x - b.x);

          setRevenueLineData({
            series: [{ name: "Doanh thu", data: sortedTrend }],
          });
        } else {
          console.warn(
            "API did not return revenueTrend. Using dummy data for line chart."
          );
          let dummyTrendData = [];
          let dateFormat = "dd MMM";
          if (filterType === "TODAY") {
            // hourly might be better here if API supports
            for (let i = 23; i >= 0; i--) {
              // Example: last 24 hours
              dummyTrendData.push({
                x: dayjs().subtract(i, "hour").valueOf(),
                y: Math.random() * 500000 + 100000,
              });
            }
            dateFormat = "HH:mm";
          } else if (filterType === "WEEK") {
            for (let i = 6; i >= 0; i--) {
              dummyTrendData.push({
                x: dayjs().subtract(i, "day").valueOf(),
                y: Math.random() * 5000000 + 1000000,
              });
            }
          } else if (filterType === "MONTH") {
            for (let i = 29; i >= 0; i -= 3) {
              dummyTrendData.push({
                x: dayjs().subtract(i, "day").valueOf(),
                y: Math.random() * 10000000 + 2000000,
              });
            }
          } else if (filterType === "YEAR") {
            for (let i = 11; i >= 0; i--) {
              dummyTrendData.push({
                x: dayjs().subtract(i, "month").valueOf(),
                y: Math.random() * 50000000 + 10000000,
              });
            }
            dateFormat = "MMM yyyy";
          }
          setRevenueLineData({
            series: [
              {
                name: "Doanh thu",
                data: dummyTrendData.sort((a, b) => a.x - b.x),
              },
            ],
            xaxisFormat: dateFormat, // Store the format for the chart options
          });
        }
      } else {
        setDataDashboard(null);
        setDataDashboardPie([0, 0, 0, 0, 0, 0, 0]);
        setRevenueLineData({ series: [{ name: "Doanh thu", data: [] }] });
      }
    });
  };

  const handleDateRangeSearch = () => {
    if (
      startDate &&
      endDate &&
      dayjs(startDate).isValid() &&
      dayjs(endDate).isValid()
    ) {
      if (dayjs(endDate).isBefore(dayjs(startDate))) {
        console.error("End date cannot be before start date.");
        return;
      }
      fetchData(selectedFilter, {
        fromDate: dayjs(startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
        toDate: dayjs(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
      });
    }
  };

  useEffect(() => {
    if (selectedFilter !== "FT") {
      fetchData(selectedFilter);
    } else if (startDate && endDate) {
      handleDateRangeSearch();
    }
  }, [selectedFilter]);

  useEffect(() => {
    getBestSale({}).then(({ data }) => {
      if (data && data.data) {
        const sortedBestSale = [...data.data].sort(
          (a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0)
        );
        setBestSale(sortedBestSale);
      } else {
        setBestSale([]);
      }
    });
    getRunningOut({}).then(({ data }) => {
      if (data && data.data) {
        const sortedRunningOut = [...data.data].sort(
          (a, b) => (a.stock || 0) - (b.stock || 0)
        );
        setRunningOut(sortedRunningOut);
      } else {
        setRunningOut([]);
      }
    });
  }, []);

  const pieChartDynamicOptions = {
    ...pieChartBaseOptions,
    chart: {
      ...pieChartBaseOptions.chart,
      height: 380,
    },
  };

  const revenueLineChartOptions = {
    chart: {
      type: "area",
      height: 370,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      fontFamily: "inherit",
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
        format: revenueLineData.xaxisFormat || "dd MMM", // Use dynamic format
        style: { colors: "#666", fontSize: "12px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: true, color: "#ccc" },
      tooltip: { enabled: true },
    },
    yaxis: {
      title: {
        text: "Doanh thu (VND)",
        style: { color: "#666", fontSize: "13px", fontWeight: 500 },
      },
      labels: {
        formatter: (value) => {
          if (Math.abs(value) >= 1000000)
            return `${(value / 1000000).toFixed(1)} Tr`;
          if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(0)} K`;
          return formatCurrencyVND(value);
        },
        style: { colors: "#666", fontSize: "12px" },
      },
    },
    tooltip: {
      x: {
        format: revenueLineData.xaxisFormat
          ? revenueLineData.xaxisFormat === "HH:mm"
            ? "dd MMM yyyy, HH:mm"
            : "dd MMM yyyy"
          : "dd MMM yyyy",
      },
      y: {
        formatter: (value) => formatCurrencyVND(value || 0),
      },
      theme: "light",
      style: {
        fontSize: "13px",
        fontFamily: "inherit",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: "#e0e0e0",
      strokeDashArray: 4,
      row: { colors: ["transparent", "transparent"], opacity: 0.5 },
    },
    colors: ["#008FFB"],
  };

  const summaryStats = dataDashboard
    ? [
        {
          title: "Tổng doanh thu",
          value: dataDashboard.totalRevenue,
          render: (val) => formatCurrencyVND(val || 0),
          icon: dollorSVG,
          color: "#008FFB",
        },
        {
          title: "Tổng sản phẩm bán",
          value: dataDashboard.totalQuantity || 0,
          icon: cartSVG,
          color: "#00E396",
        },
        {
          title: "Đơn thành công",
          value: dataDashboard.totalSuccess || 0,
          icon: heartSVG,
          color: "#FEB019",
        },
        {
          title: "Đơn bị hủy",
          value: dataDashboard.totalCancel || 0,
          icon: cancelledSVG,
          color: "#FF4560",
        },
      ]
    : Array(4)
        .fill(null)
        .map((_, i) => ({
          title: [
            "Tổng doanh thu",
            "Tổng sản phẩm bán",
            "Đơn thành công",
            "Đơn bị hủy",
          ][i],
          value: 0,
          icon: [dollorSVG, cartSVG, heartSVG, cancelledSVG][i],
          color: ["#008FFB", "#00E396", "#FEB019", "#FF4560"][i],
        }));

  const productTableColumnsBase = [
    {
      title: "#",
      key: "top",
      width: 50,
      align: "center",
      render: (text, record, index) => <Text strong>{index + 1}</Text>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "product",
      width: 250,
      fixed: "left",
      render: (text, record) => (
        <Text strong style={{ fontSize: "13px" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Mã SP",
      dataIndex: "code",
      key: "code",
      width: 120,
      responsive: ["md"],
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      align: "right",
      width: 100,
      sorter: (a, b) => (a.stock || 0) - (b.stock || 0),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      align: "right",
      width: 150,
      render: (price) => formatCurrencyVND(price || 0),
    },
    
  ];

  const bestSellingProductColumns = [
    ...productTableColumnsBase,
    {
      title: "Số sản phẩm đã bán",
      dataIndex: "soldQuantity",
      key: "soldQuantity",
      align: "right",
      width: 100,
      sorter: (a, b) => (a.soldQuantity || 0) - (b.soldQuantity || 0),
      defaultSortOrder: "descend",
    },
  ];

const runningOutProductColumns = [
    ...productTableColumnsBase.map(col => { // Copy các cột base
      if (col.key === 'stock') {
        return { ...col, defaultSortOrder: 'ascend' };
      }
      return col;
    }),
    // Thêm cột "Đã bán" vào đây
    {
      title: "Số sản phẩm đã bán",
      dataIndex: "soldQuantity",
      key: "soldQuantity_runningOut", // Key có thể khác để tránh trùng nếu cần
      align: "right",
      width: 100,
      sorter: (a, b) => (a.soldQuantity || 0) - (b.soldQuantity || 0),
      // Bạn có thể không cần defaultSortOrder ở đây, hoặc để 'descend' nếu muốn
    }
  ];

  const cardStyle = {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    borderRadius: "8px",
    border: "1px solid #e8e8e8",
  };

  return (
    <div
      className="layout-content"
      style={{ padding: "24px", backgroundColor: "#f7f9fc" }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card bordered={false} style={cardStyle}>
          <Form layout="vertical" onFinish={handleDateRangeSearch}>
            <Row gutter={[16, 16]} align="bottom">
              <Col
                xs={24}
                sm={12}
                md={!startDate && !endDate && selectedFilter !== "FT" ? 24 : 6}
              >
                <Form.Item
                  label={<Text strong>Lọc theo thời gian</Text>}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    style={{ width: "100%" }}
                    onChange={handleFilterChange}
                    options={filters}
                    value={selectedFilter}
                    size="large"
                  />
                </Form.Item>
              </Col>
              {selectedFilter === "FT" && (
                <>
                  <Col xs={24} sm={12} md={7}>
                    <Form.Item
                      label={<Text strong>Từ ngày</Text>}
                      name="startDate"
                      style={{ marginBottom: 0 }}
                    >
                      <DatePicker
                        showTime
                        format="DD-MM-YYYY HH:mm:ss"
                        onChange={setStartDate}
                        style={{ width: "100%" }}
                        value={startDate ? dayjs(startDate) : null}
                        size="large"
                        placeholder="Chọn ngày bắt đầu"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={7}>
                    <Form.Item
                      label={<Text strong>Đến ngày</Text>}
                      name="endDate"
                      style={{ marginBottom: 0 }}
                    >
                      <DatePicker
                        showTime
                        format="DD-MM-YYYY HH:mm:ss"
                        onChange={setEndDate}
                        style={{ width: "100%" }}
                        value={endDate ? dayjs(endDate) : null}
                        size="large"
                        placeholder="Chọn ngày kết thúc"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={4}>
                    <Form.Item style={{ marginBottom: 0 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={!startDate || !endDate}
                        block
                        size="large"
                      >
                        Áp dụng
                      </Button>
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>
          </Form>
        </Card>

        <Row gutter={[20, 20]}>
          {summaryStats.map((stat, index) => (
            <Col key={index} xs={24} sm={12} md={12} lg={6}>
              <Card bordered={false} style={cardStyle}>
                <Statistic
                  title={
                    <Text
                      style={{
                        fontSize: "14px",
                        color: "rgba(0, 0, 0, 0.65)",
                        fontWeight: 500,
                      }}
                    >
                      {stat.title}
                    </Text>
                  }
                  value={stat.render ? stat.render(stat.value) : stat.value}
                  valueStyle={{
                    color: stat.color,
                    fontSize: "26px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  prefix={
                    <span
                      style={{
                        color: stat.color,
                        marginRight: "10px",
                        fontSize: "24px",
                      }}
                    >
                      {stat.icon}
                    </span>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[20, 20]}>
          <Col xs={24} md={12} lg={8} xl={7}>
            <Card
              title={
                <Title level={4} style={{ marginBottom: 0 }}>
                  Trạng thái đơn hàng
                </Title>
              }
              bordered={false}
              style={{ ...cardStyle, height: "100%", minHeight: "420px" }}
            >
              {dataDashboardPie.some((value) => value > 0) ? (
                <ReactApexChart
                  options={pieChartDynamicOptions}
                  series={dataDashboardPie}
                  type="pie"
                  height={380}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "350px",
                  }}
                >
                  <Empty description="Không có dữ liệu thống kê đơn hàng" />
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} md={12} lg={16} xl={17}>
            <Card
              title={
                <Title level={4} style={{ marginBottom: 0 }}>
                  Biểu đồ tăng trưởng doanh thu
                </Title>
              }
              bordered={false}
              style={{ ...cardStyle, height: "100%", minHeight: "420px" }}
            >
              {revenueLineData.series[0]?.data?.length > 0 ? (
                <ReactApexChart
                  options={revenueLineChartOptions}
                  series={revenueLineData.series}
                  type="area"
                  height={370}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "350px",
                  }}
                >
                  <Empty description="Không có dữ liệu doanh thu cho khoảng thời gian này." />
                </div>
              )}
            </Card>
          </Col>
        </Row>

        <Row gutter={[20, 20]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Title level={4} style={{ marginBottom: 0 }}>
                  Top 5 sản phẩm bán chạy nhất
                </Title>
              }
              bordered={false}
              style={cardStyle}
            >
              <Table
                columns={bestSellingProductColumns}
                dataSource={bestSale}
                rowKey={(record) => record.id || record.code}
                pagination={{ pageSize: 5, simple: true, size: "default" }}
                scroll={{ x: 700 }}
                size="middle"
                className="professional-table"
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Title level={4} style={{ marginBottom: 0 }}>
                  Top 5 sản phẩm sắp hết hàng
                </Title>
              }
              bordered={false}
              style={cardStyle}
            >
              <Table
                columns={runningOutProductColumns}
                dataSource={runningOut}
                rowKey={(record) => record.id || record.code}
                pagination={{ pageSize: 5, simple: true, size: "default" }}
                scroll={{ x: 700 }} // Adjusted scroll to match best selling
                size="middle"
                className="professional-table"
              />
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
}
