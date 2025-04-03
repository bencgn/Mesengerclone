# Messenger Clone

## Tổng quan

Messenger Clone là ứng dụng nhắn tin thời gian thực mô phỏng Facebook Messenger, được xây dựng với các công nghệ hiện đại bao gồm Node.js, Express, MongoDB và Socket.IO. Ứng dụng hỗ trợ đăng ký và đăng nhập người dùng, trò chuyện trực tiếp, hiển thị trạng thái online, gửi biểu tượng cảm xúc và nhiều tính năng khác.

## Tính năng chính

- **Xác thực người dùng**: Đăng ký tài khoản mới và đăng nhập
- **Nhắn tin thời gian thực**: Sử dụng Socket.IO để gửi và nhận tin nhắn ngay lập tức
- **Chỉ báo trạng thái**: Hiển thị khi người dùng online/offline
- **Chỉ báo đang nhập**: Hiển thị khi người khác đang nhập tin nhắn
- **Xác nhận đã đọc**: Theo dõi tin nhắn đã được đọc
- **Hỗ trợ biểu tượng cảm xúc**: Gửi và hiển thị emoji trong tin nhắn
- **Lịch sử tin nhắn**: Lưu trữ và hiển thị các cuộc trò chuyện trước đó
- **Quan hệ bạn bè**: Thêm và quản lý danh sách bạn bè
- **Tìm kiếm người dùng**: Tìm kiếm người dùng theo tên hoặc email
- **Thiết kế responsive**: Hoạt động tốt trên cả máy tính và thiết bị di động

## Yêu cầu hệ thống

Trước khi bắt đầu, đảm bảo bạn đã cài đặt:

- **Node.js**: Phiên bản 14.x trở lên - [Tải Node.js](https://nodejs.org/)
- **MongoDB**: Cài đặt cục bộ hoặc tài khoản MongoDB Atlas - [Tải MongoDB Community](https://www.mongodb.com/try/download/community)
- **Git**: Để clone repository (nếu cần) - [Tải Git](https://git-scm.com/downloads)
- **Trình soạn thảo mã**: Visual Studio Code, Sublime Text, hoặc bất kỳ IDE nào bạn thích

## Hướng dẫn cài đặt chi tiết

### 1. Clone dự án (nếu sử dụng Git)

```bash
git clone <repository-url>
cd Mesengerclone
```

Hoặc giải nén tệp dự án vào thư mục mong muốn.

### 2. Cài đặt các thư viện phụ thuộc

Mở terminal/command prompt tại thư mục dự án và chạy:

```bash
npm install
```

Lệnh này sẽ cài đặt tất cả các thư viện cần thiết được liệt kê trong file `package.json`.

### 3. Cấu hình biến môi trường

1. Đổi tên file `.env.example` thành `.env` (hoặc tạo file `.env` mới nếu chưa có)
2. Cập nhật các biến trong file `.env` như sau:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/messenger_clone
JWT_SECRET=your_secret_key_here
```

Trong đó:
- `PORT`: Cổng máy chủ web (mặc định là 3000)
- `MONGODB_URI`: Đường dẫn kết nối đến MongoDB
  - Đối với MongoDB cục bộ: `mongodb://localhost:27017/messenger_clone`
  - Đối với MongoDB Atlas: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/messenger_clone?retryWrites=true&w=majority`
- `JWT_SECRET`: Khóa bí mật để tạo và xác thực JWT tokens (thay đổi thành một chuỗi ngẫu nhiên an toàn)

### 4. Cài đặt và cấu hình MongoDB

#### Cài đặt MongoDB cục bộ (Windows)

1. **Tải MongoDB Community Server**:
   - Truy cập [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Chọn phiên bản mới nhất cho Windows
   - Chọn gói cài đặt "MSI"
   - Tải xuống và chạy trình cài đặt

2. **Hoàn tất quá trình cài đặt**:
   - Chấp nhận thỏa thuận cấp phép
   - Chọn cài đặt kiểu "Complete"
   - Có thể giữ tùy chọn "Install MongoDB as a Service" được chọn
   - Thiết lập thư mục dữ liệu (mặc định là tốt)
   - Hoàn tất cài đặt

3. **Xác minh cài đặt**:
   - Mở Command Prompt hoặc PowerShell
   - Chạy lệnh `mongod --version` để kiểm tra cài đặt

4. **Khởi động dịch vụ MongoDB**:
   - Dịch vụ sẽ tự động khởi động nếu bạn đã cài đặt nó như một dịch vụ
   - Nếu không, chạy `net start MongoDB` trong Command Prompt với quyền Administrator

5. **Tạo cơ sở dữ liệu**:
   - Mở Command Prompt mới
   - Chạy `mongosh`
   - Chạy `use messenger_clone`
   - Chạy `exit`

#### Cài đặt MongoDB Atlas (Đám mây)

1. **Tạo tài khoản MongoDB Atlas**:
   - Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Đăng ký tài khoản miễn phí

2. **Tạo cluster mới**:
   - Nhấp "Build a Cluster"
   - Chọn gói miễn phí
   - Chọn nhà cung cấp đám mây và khu vực
   - Nhấp "Create Cluster"

3. **Thiết lập quyền truy cập cơ sở dữ liệu**:
   - Đi đến phần "Database Access"
   - Nhấp "Add New Database User"
   - Tạo tên người dùng và mật khẩu (lưu trữ an toàn)
   - Thiết lập quyền phù hợp (đọc và ghi vào bất kỳ cơ sở dữ liệu nào)
   - Nhấp "Add User"

4. **Thiết lập quyền truy cập mạng**:
   - Đi đến phần "Network Access"
   - Nhấp "Add IP Address"
   - Có thể chọn "Allow Access From Anywhere" (0.0.0.0/0) cho phát triển
   - Nhấp "Confirm"

5. **Lấy chuỗi kết nối**:
   - Nhấp "Connect" trên cluster của bạn
   - Chọn "Connect your application"
   - Sao chép chuỗi kết nối
   - Thay thế `<password>` bằng mật khẩu người dùng đã tạo
   - Thay thế `<dbname>` bằng `messenger_clone`

6. **Cập nhật file .env**:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/messenger_clone?retryWrites=true&w=majority
   ```

### 5. Khởi tạo dữ liệu mẫu (tùy chọn)

Để tạo dữ liệu mẫu với các người dùng và tin nhắn:

```bash
npm run seed
```

Lệnh này sẽ tạo các tài khoản người dùng mẫu sau:
- **Email**: john@example.com, **Mật khẩu**: password123
- **Email**: jane@example.com, **Mật khẩu**: password123
- **Email**: mike@example.com, **Mật khẩu**: password123
- **Email**: sara@example.com, **Mật khẩu**: password123

### 6. Khởi chạy ứng dụng

Chế độ phát triển (với tự động tải lại):
```bash
npm run dev
```

Chế độ sản xuất:
```bash
npm start
```

Sau khi khởi chạy, ứng dụng sẽ có sẵn tại địa chỉ `http://localhost:3000`

## Cấu trúc dự án

```
messenger-clone/
├── config/             # Tệp cấu hình
│   ├── db.js           # Kết nối cơ sở dữ liệu
│   └── socket.js       # Thiết lập Socket.IO
├── controllers/        # Bộ điều khiển
│   ├── authController.js    # Xử lý xác thực
│   ├── messageController.js # Xử lý tin nhắn
│   └── userController.js    # Xử lý người dùng
├── middleware/         # Middleware tùy chỉnh
│   └── authMiddleware.js    # Middleware xác thực
├── models/             # Mô hình cơ sở dữ liệu
│   ├── Message.js      # Mô hình tin nhắn
│   └── User.js         # Mô hình người dùng
├── public/             # Tài nguyên tĩnh
│   ├── css/            # Tệp CSS
│   ├── img/            # Hình ảnh
│   └── js/             # Mã JavaScript
├── routes/             # Định tuyến API
│   ├── authRoutes.js   # Đường dẫn xác thực
│   ├── messageRoutes.js # Đường dẫn tin nhắn
│   └── userRoutes.js   # Đường dẫn người dùng
├── views/              # Giao diện người dùng
│   └── index.html      # Trang HTML chính
├── .env                # Biến môi trường
├── .env.example        # Mẫu biến môi trường
├── .gitignore          # Tệp cấu hình Git
├── package.json        # Thư viện phụ thuộc
├── seed.js             # Tạo dữ liệu mẫu
└── server.js           # Tệp chính ứng dụng
```

## Tài liệu API

### Xác thực (Authentication)

- `POST /api/auth/register` - Đăng ký người dùng mới
  - Body: `{ username, email, password }`
  - Response: `{ _id, username, email, avatar, token }`

- `POST /api/auth/login` - Đăng nhập
  - Body: `{ email, password }`
  - Response: `{ _id, username, email, avatar, isOnline, token }`

- `GET /api/auth/profile` - Lấy thông tin người dùng (yêu cầu xác thực)
  - Header: `Authorization: Bearer <token>`
  - Response: `{ _id, username, email, avatar, isOnline, lastSeen, friends }`

- `POST /api/auth/logout` - Đăng xuất (yêu cầu xác thực)
  - Header: `Authorization: Bearer <token>`
  - Response: `{ message: 'Logged out successfully' }`

### Người dùng (Users)

- `GET /api/users` - Lấy tất cả người dùng (yêu cầu xác thực)
  - Header: `Authorization: Bearer <token>`
  - Response: `[{ _id, username, email, avatar, isOnline, lastSeen }]`

- `GET /api/users/search?keyword=<search>` - Tìm kiếm người dùng (yêu cầu xác thực)
  - Header: `Authorization: Bearer <token>`
  - Response: `[{ _id, username, email, avatar, isOnline, lastSeen }]`

- `GET /api/users/:id` - Lấy thông tin người dùng theo ID (yêu cầu xác thực)
  - Header: `Authorization: Bearer <token>`
  - Response: `{ _id, username, email, avatar, isOnline, lastSeen }`

- `PUT /api/users/status` - Cập nhật trạng thái online (yêu cầu xác thực)
  - Header: `Authorization: Bearer <token>`
  - Body: `{ isOnline }`
  - Response: `{ _id, isOnline, lastSeen }`

- `PUT /api/users/friends/:id` - Thêm bạn (yêu cầu xác thực)
  - Header: `Authorization: Bearer <token>`
  - Response: `{ message: 'Friend added successfully' }`

### Tin nhắn (Messages)

- `GET /api/messages` - Lấy tất cả cuộc trò chuyện (yêu cầu xác thực)
  - Header: `Authorization: Bearer <token>`
  - Response: `[{ _id, partner, lastMessage, unreadCount }]`

- `GET /api/messages/:userId` - Lấy tin nhắn với người dùng cụ thể (yêu cầu xác thực)
  - Header: `Authorization: Bearer <token>`
  - Response: `[{ _id, sender, recipient, content, contentType, isRead, readAt, createdAt }]`

- `POST /api/messages` - Gửi tin nhắn (yêu cầu xác thực)
  - Header: `Authorization: Bearer <token>`
  - Body: `{ recipientId, content, contentType }`
  - Response: `{ _id, sender, recipient, content, contentType, isRead, createdAt }`

## Sự kiện Socket.IO

### Client đến Server

- `user_join` - Người dùng tham gia cuộc trò chuyện
  - Data: `userId`

- `private_message` - Gửi tin nhắn riêng tư
  - Data: `{ recipientId, message }`

- `typing` - Người dùng đang nhập
  - Data: `{ recipientId, senderId, isTyping }`

- `message_read` - Tin nhắn đã được đọc
  - Data: `{ senderId, messageId }`

### Server đến Client

- `active_users` - Danh sách người dùng đang hoạt động
  - Data: `[userId1, userId2, ...]`

- `user_status_change` - Trạng thái người dùng thay đổi
  - Data: `{ userId, isOnline }`

- `new_message` - Tin nhắn mới nhận được
  - Data: `{ messageObject }`

- `typing_indicator` - Chỉ báo người dùng đang nhập
  - Data: `{ senderId, isTyping }`

- `message_read_receipt` - Xác nhận tin nhắn đã đọc
  - Data: `{ messageId }`

## Xử lý sự cố thường gặp

### Không thể kết nối đến MongoDB

1. Kiểm tra xem MongoDB đã được cài đặt và đang chạy:
   - Windows: `sc query MongoDB` hoặc `net start MongoDB`
   - Kiểm tra cổng 27017 có đang được sử dụng: `netstat -ano | findstr :27017`

2. Kiểm tra chuỗi kết nối trong file `.env`

3. Đảm bảo tường lửa không chặn kết nối đến MongoDB

### Lỗi khi chạy ứng dụng

1. Đảm bảo đã cài đặt tất cả các thư viện phụ thuộc: `npm install`

2. Kiểm tra phiên bản Node.js: `node --version`

3. Kiểm tra các lỗi trong console

4. Nếu cổng 3000 đã được sử dụng, thay đổi cổng trong file `.env`

### Không thể đăng nhập hoặc đăng ký

1. Kiểm tra kết nối đến MongoDB

2. Kiểm tra lỗi trong console của trình duyệt

3. Kiểm tra JWT_SECRET trong file `.env`

## Khắc phục lỗi Socket.IO

1. Đảm bảo client và server sử dụng cùng phiên bản Socket.IO

2. Kiểm tra kết nối WebSocket trong tab Network của DevTools

3. Kiểm tra lỗi CORS

## Giấy phép

Dự án này được cấp phép theo Giấy phép MIT.

---

# Messenger Clone (English Version)

## Overview

Messenger Clone is a real-time chat application that mimics Facebook Messenger, built with modern technologies including Node.js, Express, MongoDB, and Socket.IO. The application supports user registration and login, real-time messaging, online status display, emoji sending, and many other features.

## Key Features

- **User Authentication**: Register new accounts and login
- **Real-time Messaging**: Use Socket.IO to send and receive messages instantly
- **Status Indicators**: Show when users are online/offline
- **Typing Indicators**: Display when others are typing messages
- **Read Receipts**: Track when messages have been read
- **Emoji Support**: Send and display emojis in messages
- **Message History**: Store and display previous conversations
- **Friend Relationships**: Add and manage friend lists
- **User Search**: Search for users by name or email
- **Responsive Design**: Works well on both desktop and mobile devices

## System Requirements

Before you begin, make sure you have installed:

- **Node.js**: Version 14.x or higher - [Download Node.js](https://nodejs.org/)
- **MongoDB**: Local installation or MongoDB Atlas account - [Download MongoDB Community](https://www.mongodb.com/try/download/community)
- **Git**: For cloning the repository (if needed) - [Download Git](https://git-scm.com/downloads)
- **Code Editor**: Visual Studio Code, Sublime Text, or any IDE you prefer

## Detailed Installation Guide

### 1. Clone the project (if using Git)

```bash
git clone <repository-url>
cd Mesengerclone
```

Or extract the project files to your desired folder.

### 2. Install dependencies

Open terminal/command prompt in the project directory and run:

```bash
npm install
```

This will install all necessary libraries listed in the `package.json` file.

### 3. Configure environment variables

1. Rename the `.env.example` file to `.env` (or create a new `.env` file if none exists)
2. Update the variables in the `.env` file as follows:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/messenger_clone
JWT_SECRET=your_secret_key_here
```

Where:
- `PORT`: Web server port (default is 3000)
- `MONGODB_URI`: MongoDB connection path
  - For local MongoDB: `mongodb://localhost:27017/messenger_clone`
  - For MongoDB Atlas: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/messenger_clone?retryWrites=true&w=majority`
- `JWT_SECRET`: Secret key for creating and validating JWT tokens (change to a secure random string)

### 4. Install and configure MongoDB

#### Local MongoDB Setup (Windows)

1. **Download MongoDB Community Server**:
   - Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select the latest version for Windows
   - Choose the "MSI" installation package
   - Download and run the installer

2. **Complete the installation**:
   - Accept the license agreement
   - Choose "Complete" installation type
   - You can keep the "Install MongoDB as a Service" option selected
   - Set up the data directory (default is fine)
   - Complete installation

3. **Verify installation**:
   - Open Command Prompt or PowerShell
   - Run `mongod --version` to check installation

4. **Start MongoDB service**:
   - The service will start automatically if you installed it as a service
   - Otherwise, run `net start MongoDB` in Command Prompt with Administrator rights

5. **Create the database**:
   - Open a new Command Prompt
   - Run `mongosh`
   - Run `use messenger_clone`
   - Run `exit`

#### MongoDB Atlas Setup (Cloud)

1. **Create a MongoDB Atlas account**:
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a new cluster**:
   - Click "Build a Cluster"
   - Choose the free tier option
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Set up database access**:
   - Go to the "Database Access" section
   - Click "Add New Database User"
   - Create a username and password (store securely)
   - Set appropriate permissions (read and write to any database)
   - Click "Add User"

4. **Set up network access**:
   - Go to the "Network Access" section
   - Click "Add IP Address"
   - For development, you can choose "Allow Access From Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your created user's password
   - Replace `<dbname>` with `messenger_clone`

6. **Update .env file**:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/messenger_clone?retryWrites=true&w=majority
   ```

### 5. Initialize sample data (optional)

To create sample data with users and messages:

```bash
npm run seed
```

This command will create the following sample user accounts:
- **Email**: john@example.com, **Password**: password123
- **Email**: jane@example.com, **Password**: password123
- **Email**: mike@example.com, **Password**: password123
- **Email**: sara@example.com, **Password**: password123

### 6. Start the application

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

After starting, the application will be available at `http://localhost:3000`

## Project Structure

```
messenger-clone/
├── config/             # Configuration files
│   ├── db.js           # Database connection
│   └── socket.js       # Socket.IO setup
├── controllers/        # Controllers
│   ├── authController.js    # Authentication handling
│   ├── messageController.js # Message handling
│   └── userController.js    # User handling
├── middleware/         # Custom middleware
│   └── authMiddleware.js    # Authentication middleware
├── models/             # Database models
│   ├── Message.js      # Message model
│   └── User.js         # User model
├── public/             # Static resources
│   ├── css/            # CSS files
│   ├── img/            # Images
│   └── js/             # JavaScript code
├── routes/             # API routes
│   ├── authRoutes.js   # Authentication routes
│   ├── messageRoutes.js # Message routes
│   └── userRoutes.js   # User routes
├── views/              # User interface
│   └── index.html      # Main HTML page
├── .env                # Environment variables
├── .env.example        # Environment variables template
├── .gitignore          # Git configuration file
├── package.json        # Dependencies
├── seed.js             # Sample data generator
└── server.js           # Main application file
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ username, email, password }`
  - Response: `{ _id, username, email, avatar, token }`

- `POST /api/auth/login` - Login
  - Body: `{ email, password }`
  - Response: `{ _id, username, email, avatar, isOnline, token }`

- `GET /api/auth/profile` - Get user profile (requires authentication)
  - Header: `Authorization: Bearer <token>`
  - Response: `{ _id, username, email, avatar, isOnline, lastSeen, friends }`

- `POST /api/auth/logout` - Logout (requires authentication)
  - Header: `Authorization: Bearer <token>`
  - Response: `{ message: 'Logged out successfully' }`

### Users

- `GET /api/users` - Get all users (requires authentication)
  - Header: `Authorization: Bearer <token>`
  - Response: `[{ _id, username, email, avatar, isOnline, lastSeen }]`

- `GET /api/users/search?keyword=<search>` - Search users (requires authentication)
  - Header: `Authorization: Bearer <token>`
  - Response: `[{ _id, username, email, avatar, isOnline, lastSeen }]`

- `GET /api/users/:id` - Get user by ID (requires authentication)
  - Header: `Authorization: Bearer <token>`
  - Response: `{ _id, username, email, avatar, isOnline, lastSeen }`

- `PUT /api/users/status` - Update online status (requires authentication)
  - Header: `Authorization: Bearer <token>`
  - Body: `{ isOnline }`
  - Response: `{ _id, isOnline, lastSeen }`

- `PUT /api/users/friends/:id` - Add friend (requires authentication)
  - Header: `Authorization: Bearer <token>`
  - Response: `{ message: 'Friend added successfully' }`

### Messages

- `GET /api/messages` - Get all conversations (requires authentication)
  - Header: `Authorization: Bearer <token>`
  - Response: `[{ _id, partner, lastMessage, unreadCount }]`

- `GET /api/messages/:userId` - Get messages with a specific user (requires authentication)
  - Header: `Authorization: Bearer <token>`
  - Response: `[{ _id, sender, recipient, content, contentType, isRead, readAt, createdAt }]`

- `POST /api/messages` - Send a message (requires authentication)
  - Header: `Authorization: Bearer <token>`
  - Body: `{ recipientId, content, contentType }`
  - Response: `{ _id, sender, recipient, content, contentType, isRead, createdAt }`

## Socket.IO Events

### Client to Server

- `user_join` - User joins the chat
  - Data: `userId`

- `private_message` - Send a private message
  - Data: `{ recipientId, message }`

- `typing` - User is typing
  - Data: `{ recipientId, senderId, isTyping }`

- `message_read` - Message has been read
  - Data: `{ senderId, messageId }`

### Server to Client

- `active_users` - List of active users
  - Data: `[userId1, userId2, ...]`

- `user_status_change` - User status changed
  - Data: `{ userId, isOnline }`

- `new_message` - New message received
  - Data: `{ messageObject }`

- `typing_indicator` - User typing indicator
  - Data: `{ senderId, isTyping }`

- `message_read_receipt` - Message read receipt
  - Data: `{ messageId }`

## Common Troubleshooting

### Cannot connect to MongoDB

1. Check if MongoDB is installed and running:
   - Windows: `sc query MongoDB` or `net start MongoDB`
   - Check if port 27017 is in use: `netstat -ano | findstr :27017`

2. Check the connection string in `.env` file

3. Ensure firewall isn't blocking MongoDB connection

### Application errors

1. Make sure all dependencies are installed: `npm install`

2. Check Node.js version: `node --version`

3. Check for errors in the console

4. If port 3000 is already in use, change the port in `.env` file

### Cannot login or register

1. Check MongoDB connection

2. Check for errors in browser console

3. Verify JWT_SECRET in `.env` file

## Socket.IO Troubleshooting

1. Ensure client and server use the same Socket.IO version

2. Check WebSocket connection in DevTools Network tab

3. Check for CORS errors

## License

This project is licensed under the MIT License.
