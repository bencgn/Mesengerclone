# MongoDB Setup Guide

This guide will help you set up MongoDB for your Messenger Clone application.

## Option 1: Local MongoDB Setup

### Windows

1. **Download MongoDB Community Server**:
   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select the latest version for Windows
   - Choose "MSI" as the package
   - Download and run the installer

2. **Complete the installation**:
   - Accept the license agreement
   - Choose "Complete" installation type
   - You can keep "Install MongoDB as a Service" checked
   - Set the data directory (default is fine)
   - Complete the installation

3. **Verify installation**:
   - Open Command Prompt or PowerShell
   - Run `mongod --version` to verify installation

4. **Start MongoDB service**:
   - The service should start automatically if you installed it as a service
   - Otherwise, run `net start MongoDB`

5. **Create the database**:
   - Open a new Command Prompt or PowerShell
   - Run `mongosh`
   - Run `use messenger_clone`
   - Run `exit`

## Option 2: MongoDB Atlas (Cloud)

1. **Create a MongoDB Atlas account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a new cluster**:
   - Click "Build a Cluster"
   - Select the free tier option
   - Choose a cloud provider and region
   - Click "Create Cluster"

3. **Set up database access**:
   - Go to the "Database Access" section
   - Click "Add New Database User"
   - Create a username and password (store these securely)
   - Set appropriate permissions (read and write to any database)
   - Click "Add User"

4. **Set up network access**:
   - Go to the "Network Access" section
   - Click "Add IP Address"
   - For development, you can choose "Allow Access From Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get your connection string**:
   - Once your cluster is created, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `<dbname>` with `messenger_clone`

6. **Update your .env file**:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/messenger_clone?retryWrites=true&w=majority
   ```

## Using the Application with MongoDB

1. **Update the .env file** with your MongoDB connection string:
   - For local: `MONGODB_URI=mongodb://localhost:27017/messenger_clone`
   - For Atlas: Use the connection string from step 5 above

2. **Seed the database (optional)**:
   ```bash
   npm run seed
   ```

3. **Start the application**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Open a web browser and go to `http://localhost:3000`
   - You can now register or login (use the seeded accounts if you ran the seed command)

## Troubleshooting

- **Connection refused error**: Make sure MongoDB is running. For local installations, run `net start MongoDB` on Windows.
- **Authentication failed**: For Atlas, check your username and password in the connection string.
- **Network error**: For Atlas, make sure your IP is whitelisted in the Network Access settings.
- **Cannot find module 'mongoose'**: Run `npm install` to install all dependencies.
