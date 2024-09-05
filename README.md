
# RFID Backend Application

This application is a Node.js-based backend service for managing RFID entries and associated video uploads. It uses Sequelize as an ORM to interact with the database, Multer for handling file uploads, and UUIDs to uniquely identify each RFID entry and its corresponding video file.

## Features

- **Create an RFID entry with video upload**: Each RFID entry contains a unique RFID code and a video file, with the file saved using a UUID.
- **Retrieve RFID entries**: You can list all RFID entries or get a specific entry by its UUID.
- **Update RFID entries**: Update the RFID code and/or replace the associated video file.
- **Delete RFID entries**: Delete an RFID entry and its associated video from the system.
- **File upload management**: Video files are uploaded and stored in the `uploads` folder. If an error occurs while creating an RFID entry, the uploaded video file is automatically deleted.

## Technologies Used

- **Node.js**: Backend runtime.
- **Express.js**: Web framework for building APIs.
- **Sequelize**: ORM for database management.
- **Multer**: Middleware for handling multipart/form-data (file uploads).
- **UUID**: For generating unique identifiers for each RFID entry and associated video file.
- **Postman**: For testing the API.
- **MySQL or PostgreSQL**: Database systems (can be configured in Sequelize).

## Prerequisites

- Node.js installed on your machine.
- A MySQL/PostgreSQL database setup and configured with Sequelize.
- A `.env` file with the following variables configured:

  ```
  DB_NAME=your_database_name
  DB_USER=your_database_user
  DB_PASSWORD=your_database_password
  DB_HOST=your_database_host
  DB_DIALECT=mysql_or_postgres
  ```

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/rfid-backend-app.git
   cd rfid-backend-app
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   Configure the `.env` file as described above, then run:

   ```bash
   npx sequelize-cli db:migrate
   ```

4. Start the server:

   ```bash
   npm start
   ```

   The server will start on `http://localhost:5001`.

## API Endpoints

### 1. Create an RFID Entry with Video Upload

- **Endpoint**: `POST /rfid`
- **Form Data**:
  - `rfidCode` (Text): The unique RFID code.
  - `video` (File): The video file associated with the RFID entry.
- **Response**: Returns the created RFID entry with the associated video URL.

Example using Postman:

1. Set method to `POST`.
2. Use `form-data` in the body:
   - `rfidCode`: A unique RFID code.
   - `video`: Upload a video file.

### 2. Retrieve All RFID Entries

- **Endpoint**: `GET /rfid`
- **Response**: Returns a list of all RFID entries.

### 3. Retrieve a Specific RFID Entry

- **Endpoint**: `GET /rfid/:id`
- **Parameters**: `id` (UUID) - The UUID of the RFID entry.
- **Response**: Returns the details of the specified RFID entry.

### 4. Update an RFID Entry

- **Endpoint**: `PUT /rfid/:id`
- **Parameters**: `id` (UUID) - The UUID of the RFID entry.
- **Form Data**:
  - `rfidCode` (optional): The updated RFID code.
  - `video` (optional): The updated video file.
- **Response**: Returns the updated RFID entry.

### 5. Delete an RFID Entry

- **Endpoint**: `DELETE /rfid/:id`
- **Parameters**: `id` (UUID) - The UUID of the RFID entry.
- **Response**: Deletes the specified RFID entry and its associated video file.

## Error Handling

- **Unique RFID Code Constraint**: If an RFID code already exists in the database, the server will return a `400 Bad Request` with an error message.
- **File Deletion on Error**: If any error occurs during the database transaction (e.g., duplicate RFID code or DB connection issue), the uploaded video file is automatically deleted to prevent unused files from remaining on the server.

## Directory Structure

```bash
.
├── db.js                  # Sequelize ORM setup
├── server.js              # Main application server
├── uploads/               # Directory where uploaded video files are stored
├── models/                # Sequelize models (e.g., RFID model)
├── migrations/            # Sequelize migration files
├── README.md              # Documentation for the app
└── .env                   # Environment configuration file
```

## File Uploads

The video files uploaded by users are stored in the `uploads/` directory. If an error occurs during the database transaction, the uploaded file is automatically deleted to keep the system clean. The files are named using a UUID to ensure uniqueness.

## Testing

You can test the API using tools like Postman or curl. Make sure to use `form-data` for the `POST` and `PUT` requests that involve file uploads.

---

## `uploads` Folder

The `uploads/` folder is where all the video files associated with RFID entries are stored.

### How It Works:

- Each video file is uploaded with a unique UUID as its filename.
- The filename also retains the original file extension (e.g., `.mp4`).
- Example of a file stored in the `uploads` folder: `7f8e6c93-a489-4cf4-b5f1-20b9c3a8e291.mp4`.

### Automatic File Deletion:

- If an error occurs while creating or updating an RFID entry, the uploaded video file is automatically deleted using the `fs.unlinkSync()` method to ensure that no unused files are stored.
- Files that are successfully associated with RFID entries remain in the `uploads/` directory and can be accessed via their URL.

### Folder Structure:

```bash
uploads/
├── 7f8e6c93-a489-4cf4-b5f1-20b9c3a8e291.mp4   # Example of an uploaded video file
├── a87b4cfa-b59f-439a-87ec-1f99c9e4d759.mp4   # Another example video file
└── ...                                        # More uploaded files
```

### Important Notes:

- **Do not manually delete or modify files in the `uploads/` directory**. Files are managed automatically by the system.
