USE [master]
GO
/****** Object:  Database [Web.ShopManager]    Script Date: 2/25/2025 12:05:37 AM ******/
CREATE DATABASE [Web.ShopManager]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Web.ShopManager', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\Web.ShopManager.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Web.ShopManager_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\Web.ShopManager_log.ldf' , SIZE = 73728KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [Web.ShopManager] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Web.ShopManager].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Web.ShopManager] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Web.ShopManager] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Web.ShopManager] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Web.ShopManager] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Web.ShopManager] SET ARITHABORT OFF 
GO
ALTER DATABASE [Web.ShopManager] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Web.ShopManager] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Web.ShopManager] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Web.ShopManager] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Web.ShopManager] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Web.ShopManager] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Web.ShopManager] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Web.ShopManager] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Web.ShopManager] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Web.ShopManager] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Web.ShopManager] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Web.ShopManager] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Web.ShopManager] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Web.ShopManager] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Web.ShopManager] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Web.ShopManager] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Web.ShopManager] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Web.ShopManager] SET RECOVERY FULL 
GO
ALTER DATABASE [Web.ShopManager] SET  MULTI_USER 
GO
ALTER DATABASE [Web.ShopManager] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Web.ShopManager] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Web.ShopManager] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Web.ShopManager] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Web.ShopManager] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Web.ShopManager] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [Web.ShopManager] SET QUERY_STORE = ON
GO
ALTER DATABASE [Web.ShopManager] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [Web.ShopManager]
GO
USE [Web.ShopManager]
GO
/****** Object:  Sequence [dbo].[coupon_SEQ]    Script Date: 2/25/2025 12:05:37 AM ******/
CREATE SEQUENCE [dbo].[coupon_SEQ] 
 AS [bigint]
 START WITH 1
 INCREMENT BY 50
 MINVALUE -9223372036854775808
 MAXVALUE 9223372036854775807
 CACHE 
GO
/****** Object:  Table [dbo].[address]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[address](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NULL,
	[address_detail] [nvarchar](150) NULL,
	[created_date] [datetime] NULL,
	[created_by] [int] NULL,
	[update_date] [datetime] NULL,
	[updated_by] [int] NULL,
	[status] [int] NULL,
	[is_deleted] [int] NULL,
	[district_id] [nvarchar](150) NULL,
	[ward_id] [nvarchar](150) NULL,
	[province_id] [nvarchar](150) NULL,
	[description] [nvarchar](250) NULL,
 CONSTRAINT [PK_Address] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[administrative_regions]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[administrative_regions](
	[id] [int] NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[name_en] [nvarchar](255) NOT NULL,
	[code_name] [nvarchar](255) NULL,
	[code_name_en] [nvarchar](255) NULL,
 CONSTRAINT [administrative_regions_pkey] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[administrative_units]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[administrative_units](
	[id] [int] NOT NULL,
	[full_name] [nvarchar](255) NULL,
	[full_name_en] [nvarchar](255) NULL,
	[short_name] [nvarchar](255) NULL,
	[short_name_en] [nvarchar](255) NULL,
	[code_name] [nvarchar](255) NULL,
	[code_name_en] [nvarchar](255) NULL,
 CONSTRAINT [administrative_units_pkey] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[card]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[card](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[created_date] [datetime] NULL,
	[created_by] [int] NULL,
	[updated_date] [datetime] NULL,
	[status] [int] NULL,
	[is_deleted] [int] NULL,
	[updated_by] [int] NULL,
 CONSTRAINT [PK_card] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[card_details]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[card_details](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[card_id] [int] NULL,
	[product_id] [int] NULL,
	[quantity] [int] NULL,
	[created_date] [datetime] NULL,
	[created_by] [int] NULL,
	[udated_date] [int] NULL,
	[update_by] [int] NULL,
	[status] [int] NULL,
	[is_deleted] [int] NULL,
 CONSTRAINT [PK_card_details] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[category]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[category](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [varchar](255) NULL,
	[name] [varchar](255) NULL,
	[description] [varchar](255) NULL,
	[status] [int] NULL,
	[is_deleted] [int] NULL,
	[created_date] [date] NULL,
	[created_by] [int] NULL,
	[updated_date] [date] NULL,
	[updated_by] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[coupon]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[coupon](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [varchar](255) NULL,
	[name] [varchar](255) NULL,
	[[description]]] [nvarchar](150) NULL,
	[type] [int] NULL,
	[min_value] [int] NULL,
	[quantity] [int] NULL,
	[status] [int] NULL,
	[is_delete] [int] NULL,
	[max_value] [int] NULL,
	[date_start] [date] NULL,
	[date_end] [date] NULL,
	[created_date] [date] NULL,
	[created_by] [int] NULL,
	[updated_date] [date] NULL,
	[updated_by] [int] NULL,
	[coupon_amount] [money] NOT NULL,
	[description] [ntext] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[delivery]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[delivery](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [nvarchar](50) NULL,
	[name] [nvarchar](50) NULL,
	[created_date] [datetime] NULL,
	[created_by] [int] NULL,
	[updated_date] [datetime] NULL,
	[updated_by] [int] NULL,
	[fee] [money] NULL,
 CONSTRAINT [PK_delivery] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[discount]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[discount](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [nvarchar](50) NULL,
	[name] [nvarchar](150) NULL,
	[description] [ntext] NULL,
	[type] [int] NULL,
	[percent] [int] NULL,
	[money_discount] [int] NULL,
	[start_date] [datetime] NULL,
	[end_date] [datetime] NULL,
	[min_value] [money] NULL,
	[max_value] [money] NULL,
	[status] [int] NULL,
	[is_deleted] [int] NULL,
	[created_date] [datetime] NULL,
	[created_by] [int] NULL,
	[updated_date] [datetime] NULL,
	[updated_by] [int] NULL,
 CONSTRAINT [PK_discount] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[districts]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[districts](
	[code] [nvarchar](20) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[name_en] [nvarchar](255) NULL,
	[full_name] [nvarchar](255) NULL,
	[full_name_en] [nvarchar](255) NULL,
	[code_name] [nvarchar](255) NULL,
	[province_code] [nvarchar](20) NULL,
	[administrative_unit_id] [int] NULL,
 CONSTRAINT [districts_pkey] PRIMARY KEY CLUSTERED 
(
	[code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[favorite]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[favorite](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[product_id] [int] NOT NULL,
	[user_id] [int] NULL,
	[created_date] [datetime] NULL,
	[created_by] [int] NULL,
	[updated_date] [datetime] NULL,
	[updated_by] [int] NULL,
 CONSTRAINT [PK_favorite] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[images]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[images](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[image_url] [nvarchar](50) NULL,
	[product_id] [int] NULL,
	[created_date] [datetime] NULL,
	[created_by] [int] NULL,
	[update_date] [datetime] NULL,
	[update_by] [int] NULL,
	[status] [int] NULL,
	[is_deleted] [int] NULL,
 CONSTRAINT [PK_images] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[order_detail]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[order_detail](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[product_id] [int] NULL,
	[order_id] [int] NULL,
	[quantity] [int] NULL,
	[total] [money] NULL,
	[created_date] [datetime] NULL,
	[created_by] [int] NULL,
	[updated_date] [datetime] NULL,
	[updated_by] [int] NULL,
	[status] [int] NULL,
	[is_deleted] [int] NULL,
	[price] [money] NULL,
	[origin_price] [money] NULL,
 CONSTRAINT [PK_order_detail] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[orders]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[orders](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [nvarchar](50) NULL,
	[user_id] [int] NULL,
	[order_date] [datetime] NULL,
	[total_price] [money] NULL,
	[status] [int] NULL,
	[stage] [int] NULL,
	[fee_delivery] [money] NULL,
	[payment_id] [int] NULL,
	[description] [ntext] NULL,
	[employee_id] [int] NULL,
	[type] [int] NULL,
	[real_price] [money] NULL,
	[created_date] [datetime] NULL,
	[created_by] [int] NULL,
	[updated_date] [datetime] NULL,
	[updated_by] [int] NULL,
	[address_id] [int] NULL,
	[coupon_id] [int] NOT NULL,
	[delivery_type] [int] NOT NULL,
 CONSTRAINT [PK_orders] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[payments]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[payments](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [varchar](255) NULL,
	[name] [varchar](255) NULL,
	[created_date] [date] NULL,
	[created_by] [int] NULL,
	[updated_date] [date] NULL,
	[updated_by] [int] NULL,
	[status] [int] NULL,
	[is_deleted] [int] NULL,
 CONSTRAINT [PK_payments] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[product]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[product](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[type_id] [int] NULL,
	[code] [varchar](255) NULL,
	[name] [varchar](255) NULL,
	[description] [varchar](255) NULL,
	[date_publish] [date] NULL,
	[price] [real] NULL,
	[price_discount] [real] NULL,
	[stock] [int] NULL,
	[format] [int] NULL,
	[created_date] [date] NULL,
	[created_by] [int] NULL,
	[updated_date] [date] NULL,
	[updated_by] [int] NULL,
	[is_deleted] [int] NULL,
	[category_id] [int] NULL,
 CONSTRAINT [PK_product] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[product_discount]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[product_discount](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[product_id] [int] NULL,
	[discount_id] [int] NULL,
	[status] [int] NULL,
	[is_deleted] [int] NULL,
 CONSTRAINT [PK_product_discount] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[provinces]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[provinces](
	[code] [nvarchar](20) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[name_en] [nvarchar](255) NULL,
	[full_name] [nvarchar](255) NOT NULL,
	[full_name_en] [nvarchar](255) NULL,
	[code_name] [nvarchar](255) NULL,
	[administrative_unit_id] [int] NULL,
	[administrative_region_id] [int] NULL,
 CONSTRAINT [provinces_pkey] PRIMARY KEY CLUSTERED 
(
	[code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[rating]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[rating](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[product_id] [int] NOT NULL,
	[user_id] [int] NOT NULL,
	[rate] [int] NULL,
	[desciption] [ntext] NULL,
	[created_date] [datetime] NULL,
	[created_by] [int] NULL,
	[updated_date] [datetime] NULL,
	[update_by] [int] NULL,
	[status] [int] NULL,
	[is_delete] [int] NULL,
 CONSTRAINT [PK_rating] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[role]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[role](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [date] NULL,
	[created_by] [int] NULL,
	[updated_date] [date] NULL,
	[updated_by] [int] NULL,
	[status] [int] NULL,
	[is_delete] [int] NULL,
	[code] [nvarchar](255) NULL,
	[name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[types]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[types](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [varchar](255) NULL,
	[name] [varchar](255) NULL,
	[description] [varchar](255) NULL,
	[status] [int] NULL,
	[is_deleted] [int] NULL,
	[created_date] [datetime] NULL,
	[created_by] [int] NULL,
	[updated_date] [datetime] NULL,
	[updated_by] [int] NULL,
 CONSTRAINT [PK_types] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [varchar](255) NULL,
	[full_name] [varchar](255) NULL,
	[image_url] [varchar](255) NULL,
	[phone_number] [varchar](255) NULL,
	[email] [varchar](255) NULL,
	[description] [varchar](255) NULL,
	[date_birth] [date] NULL,
	[gender] [bit] NULL,
	[user_name] [varchar](255) NULL,
	[password] [varchar](255) NULL,
	[created_date] [date] NULL,
	[created_by] [int] NULL,
	[updated_date] [date] NULL,
	[updated_by] [int] NULL,
	[status] [int] NULL,
	[role_id] [int] NOT NULL,
	[is_deleted] [int] NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[wards]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[wards](
	[code] [nvarchar](20) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[name_en] [nvarchar](255) NULL,
	[full_name] [nvarchar](255) NULL,
	[full_name_en] [nvarchar](255) NULL,
	[code_name] [nvarchar](255) NULL,
	[district_code] [nvarchar](20) NULL,
	[administrative_unit_id] [int] NULL,
 CONSTRAINT [wards_pkey] PRIMARY KEY CLUSTERED 
(
	[code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [idx_districts_province]    Script Date: 2/25/2025 12:05:37 AM ******/
CREATE NONCLUSTERED INDEX [idx_districts_province] ON [dbo].[districts]
(
	[province_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [idx_districts_unit]    Script Date: 2/25/2025 12:05:37 AM ******/
CREATE NONCLUSTERED INDEX [idx_districts_unit] ON [dbo].[districts]
(
	[administrative_unit_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [idx_provinces_region]    Script Date: 2/25/2025 12:05:37 AM ******/
CREATE NONCLUSTERED INDEX [idx_provinces_region] ON [dbo].[provinces]
(
	[administrative_region_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [idx_provinces_unit]    Script Date: 2/25/2025 12:05:37 AM ******/
CREATE NONCLUSTERED INDEX [idx_provinces_unit] ON [dbo].[provinces]
(
	[administrative_unit_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [idx_wards_district]    Script Date: 2/25/2025 12:05:37 AM ******/
CREATE NONCLUSTERED INDEX [idx_wards_district] ON [dbo].[wards]
(
	[district_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [idx_wards_unit]    Script Date: 2/25/2025 12:05:37 AM ******/
CREATE NONCLUSTERED INDEX [idx_wards_unit] ON [dbo].[wards]
(
	[administrative_unit_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[address]  WITH CHECK ADD  CONSTRAINT [FK_Address_UserId] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[address] CHECK CONSTRAINT [FK_Address_UserId]
GO
ALTER TABLE [dbo].[card]  WITH CHECK ADD  CONSTRAINT [FK_Card_UserId] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[card] CHECK CONSTRAINT [FK_Card_UserId]
GO
ALTER TABLE [dbo].[card_details]  WITH CHECK ADD  CONSTRAINT [FK_CardDetail_CardId] FOREIGN KEY([card_id])
REFERENCES [dbo].[card] ([id])
GO
ALTER TABLE [dbo].[card_details] CHECK CONSTRAINT [FK_CardDetail_CardId]
GO
ALTER TABLE [dbo].[card_details]  WITH CHECK ADD  CONSTRAINT [FK_CardDetail_UserId] FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
GO
ALTER TABLE [dbo].[card_details] CHECK CONSTRAINT [FK_CardDetail_UserId]
GO
ALTER TABLE [dbo].[districts]  WITH CHECK ADD  CONSTRAINT [districts_administrative_unit_id_fkey] FOREIGN KEY([administrative_unit_id])
REFERENCES [dbo].[administrative_units] ([id])
GO
ALTER TABLE [dbo].[districts] CHECK CONSTRAINT [districts_administrative_unit_id_fkey]
GO
ALTER TABLE [dbo].[districts]  WITH CHECK ADD  CONSTRAINT [districts_province_code_fkey] FOREIGN KEY([province_code])
REFERENCES [dbo].[provinces] ([code])
GO
ALTER TABLE [dbo].[districts] CHECK CONSTRAINT [districts_province_code_fkey]
GO
ALTER TABLE [dbo].[favorite]  WITH CHECK ADD  CONSTRAINT [FK_favorite_product] FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
GO
ALTER TABLE [dbo].[favorite] CHECK CONSTRAINT [FK_favorite_product]
GO
ALTER TABLE [dbo].[favorite]  WITH CHECK ADD  CONSTRAINT [FK_favorite_users] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[favorite] CHECK CONSTRAINT [FK_favorite_users]
GO
ALTER TABLE [dbo].[images]  WITH CHECK ADD  CONSTRAINT [FK_Image_ProductId] FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
GO
ALTER TABLE [dbo].[images] CHECK CONSTRAINT [FK_Image_ProductId]
GO
ALTER TABLE [dbo].[order_detail]  WITH CHECK ADD  CONSTRAINT [FK_order_detail_orders] FOREIGN KEY([order_id])
REFERENCES [dbo].[orders] ([id])
GO
ALTER TABLE [dbo].[order_detail] CHECK CONSTRAINT [FK_order_detail_orders]
GO
ALTER TABLE [dbo].[order_detail]  WITH CHECK ADD  CONSTRAINT [FK_order_detail_product] FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
GO
ALTER TABLE [dbo].[order_detail] CHECK CONSTRAINT [FK_order_detail_product]
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD FOREIGN KEY([coupon_id])
REFERENCES [dbo].[coupon] ([id])
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD FOREIGN KEY([delivery_type])
REFERENCES [dbo].[delivery] ([id])
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD  CONSTRAINT [FK_orders_address] FOREIGN KEY([address_id])
REFERENCES [dbo].[address] ([id])
GO
ALTER TABLE [dbo].[orders] CHECK CONSTRAINT [FK_orders_address]
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD  CONSTRAINT [FK_orders_employee] FOREIGN KEY([employee_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[orders] CHECK CONSTRAINT [FK_orders_employee]
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD  CONSTRAINT [FK_orders_payments] FOREIGN KEY([payment_id])
REFERENCES [dbo].[payments] ([id])
GO
ALTER TABLE [dbo].[orders] CHECK CONSTRAINT [FK_orders_payments]
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD  CONSTRAINT [FK_orders_Users] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[orders] CHECK CONSTRAINT [FK_orders_Users]
GO
ALTER TABLE [dbo].[product]  WITH CHECK ADD  CONSTRAINT [FK_Product_CategoryId] FOREIGN KEY([category_id])
REFERENCES [dbo].[category] ([id])
GO
ALTER TABLE [dbo].[product] CHECK CONSTRAINT [FK_Product_CategoryId]
GO
ALTER TABLE [dbo].[product]  WITH CHECK ADD  CONSTRAINT [FK_Product_TypeId] FOREIGN KEY([type_id])
REFERENCES [dbo].[types] ([id])
GO
ALTER TABLE [dbo].[product] CHECK CONSTRAINT [FK_Product_TypeId]
GO
ALTER TABLE [dbo].[product_discount]  WITH CHECK ADD  CONSTRAINT [FK_product_discount_discount] FOREIGN KEY([discount_id])
REFERENCES [dbo].[discount] ([id])
GO
ALTER TABLE [dbo].[product_discount] CHECK CONSTRAINT [FK_product_discount_discount]
GO
ALTER TABLE [dbo].[product_discount]  WITH CHECK ADD  CONSTRAINT [FK_product_discount_product] FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
GO
ALTER TABLE [dbo].[product_discount] CHECK CONSTRAINT [FK_product_discount_product]
GO
ALTER TABLE [dbo].[provinces]  WITH CHECK ADD  CONSTRAINT [provinces_administrative_region_id_fkey] FOREIGN KEY([administrative_region_id])
REFERENCES [dbo].[administrative_regions] ([id])
GO
ALTER TABLE [dbo].[provinces] CHECK CONSTRAINT [provinces_administrative_region_id_fkey]
GO
ALTER TABLE [dbo].[provinces]  WITH CHECK ADD  CONSTRAINT [provinces_administrative_unit_id_fkey] FOREIGN KEY([administrative_unit_id])
REFERENCES [dbo].[administrative_units] ([id])
GO
ALTER TABLE [dbo].[provinces] CHECK CONSTRAINT [provinces_administrative_unit_id_fkey]
GO
ALTER TABLE [dbo].[rating]  WITH CHECK ADD FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
GO
ALTER TABLE [dbo].[rating]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[users]  WITH CHECK ADD FOREIGN KEY([role_id])
REFERENCES [dbo].[role] ([id])
GO
ALTER TABLE [dbo].[wards]  WITH CHECK ADD  CONSTRAINT [wards_administrative_unit_id_fkey] FOREIGN KEY([administrative_unit_id])
REFERENCES [dbo].[administrative_units] ([id])
GO
ALTER TABLE [dbo].[wards] CHECK CONSTRAINT [wards_administrative_unit_id_fkey]
GO
ALTER TABLE [dbo].[wards]  WITH CHECK ADD  CONSTRAINT [wards_district_code_fkey] FOREIGN KEY([district_code])
REFERENCES [dbo].[districts] ([code])
GO
ALTER TABLE [dbo].[wards] CHECK CONSTRAINT [wards_district_code_fkey]
GO
/****** Object:  StoredProcedure [dbo].[employee_generateCode]    Script Date: 2/25/2025 12:05:37 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[employee_generateCode]
	-- Add the parameters for the stored procedure here
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
/*	SET NOCOUNT OFF;
	DECLARE @codeGen NVARCHAR(50), @idLastest INT = 0
	SELECT @idLastest = MAX(e.id) FROM [dbo].[employee] as e
	IF(ISNULL(@idLastest, 0) <= 0)
	  BEGIN 
	    SET @idLastest = 0;
	  END
	SET @idLastest = @idLastest + 1;
	SET @codeGen = RIGHT('000000' + CAST(@idLastest AS VARCHAR(6)), 6);
	SET @codeGen = 'EMP' + @codeGen;
	SELECT @codeGen;
	*/
	select 'test'
END
GO
USE [master]
GO
ALTER DATABASE [Web.ShopManager] SET  READ_WRITE 
GO
