# 🛒 EasyMart - E-commerce Platform  

EasyMart is an e-commerce platform where users can **purchase products**, and **sellers can add products to sell**.  
This platform provides both functionalities, making it easy for vendors and customers to interact in one place.  

## 📌 Project Status: Phase 1  
Currently, we have implemented the **first phase** of the project, where:  
✅ Users can **sign up and log in** as either a **Vendor** or a **Customer**.  
✅ **Authentication** is handled using **JWT (JSON Web Token)**.  
✅ **Emails** are sent using **NodeMailer**.  
✅ **MySQL** is used for storing user data.  

## 📌 Project Status: Phase 2  

In **Phase 2**, EasyMart was enhanced with complete **role-based functionality**, offering unique experiences for **customers** and **vendors**.

---

### 👥 Role-Based Dashboards  

- 🔐 After login, users are redirected to **separate home pages** based on their role:
  - **Customers** see a standard shopping interface.
  - **Vendors** access a dashboard for managing their products.

---

### 🧑‍💼 Customer Features  

Customers have access to a full-fledged shopping interface:

#### 🔐 Account Management  
- View profile details  
- Edit profile information  
- Change password  
- Forgot password with email verification  
- Delete account with confirmation  

#### 🛍️ Shopping Features  
- Browse products by category  
- View detailed product pages  
- Add/remove items to/from wishlist  
- Add/remove items to/from shopping cart  
- Explore personalized “Top Picks” section  

---

### 🧑‍💻 Vendor Features  

Vendors manage their shop and product listings:

#### 🔐 Account Management  
- View and edit profile  
- Change password  
- Forgot password via email  
- Delete account  

#### 🛒 Product Management  
- Add new products  
- View all uploaded products  
- Edit product details  
- Delete products  

---

### ✅ Summary of Phase 2 Additions  

| Area                | Features Implemented                                           |
|---------------------|----------------------------------------------------------------|
| Role-based Views    | Separate dashboards for Customer and Vendor                   |
| Customer Side       | Profile, Edit, Delete, Wishlist, Cart, Top Picks, Product View |
| Vendor Side         | Product Add/Edit/Delete, Profile Management                   |
| Shared Features     | Change Password, Forgot Password (email), Delete Account       |

---


## 🛠️ Tech Stack  
### 💻 Frontend  
- **React.js** – For building the user interface  

### 🖥️ Backend  
- **Node.js** – Backend runtime  
- **Express.js** – Server framework  

### 🗄️ Database  
- **MySQL** – For storing user and product data  

### 🔐 Authentication  
- **JWT (JSON Web Token)** – Secure user authentication  

### 📧 Email Service  
- **NodeMailer** – For sending confirmation and notification emails  

---

## 🚀 Installation and Setup  

### 1️⃣ Clone the repository  
```sh
git clone https://github.com/ydv-kanchan/EasyMart.git 
cd EasyMart
