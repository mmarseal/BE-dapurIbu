# 🍳 BE-DapurIbu

**BE-DapurIbu** is the backend service for the **DapurIbu App**, a platform designed for mothers and anyone who wants to find cooking inspiration.
Not only can users explore recipes, but they can also **share their own recipes** with others, making it a community-driven cooking space.

---

## ✨ Features

* User authentication (register & login with JWT)
* Recipe management (create, read, update, delete)
* Image upload & storage with **Cloudinary**
* RESTful API ready for integration with frontend
* Scalable structure for future features (e.g. favorites, saved recipes)

---

## 🛠 Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB / Mongoose**
* **Cloudinary** (media storage)
* **Vercel** (deployment platform)

---

## ⚡ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/mmarseal/BE-dapurIbu.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root folder and add the following:

```env
PORT=3000
MONGO_URI=<YOUR_MONGO_DB_URI>
JWT_SECRET=<YOUR_VERY_HARD_TO_FIND_SECRET>

CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>

API_URL=<YOUR_DEPLOYED_API_URL>
```

### 4. Run the server

```bash
npm run dev
```

The server will start at:

```
http://localhost:3000
```
