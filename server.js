const express = require("express");
const { RFID } = require("./db"); // Import the RFID model
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Import fs to handle file deletion
const { v4: uuidv4 } = require("uuid"); // Use UUID to generate unique IDs

const app = express();
const port = 5001;

// Multer setup for file uploads with custom filename using the generated UUID
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Define the folder for video uploads
  },
  filename: (req, file, cb) => {
    const rfidId = uuidv4(); // Generate UUID for the RFID entry
    req.rfidId = rfidId; // Store the generated RFID ID in the request object
    const fileExtension = path.extname(file.originalname); // Get the file extension (e.g., .mp4)
    cb(null, `${rfidId}${fileExtension}`); // Save the file with the UUID as the name
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// Helper function to delete a file
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // Remove the file from the file system
  }
};

// Create a new RFID entry and upload a video
app.post("/rfid", upload.single("video"), async (req, res) => {
  try {
    const { rfidCode } = req.body;
    const videoUrl = `/uploads/${req.file.filename}`; // Get the uploaded file path, already named with UUID

    // Create the RFID entry using the generated UUID and video URL
    const rfidEntry = await RFID.create({
      id: req.rfidId, // Use the pre-generated UUID for the ID
      rfidCode,
      videoUrl,
    });
    res.json(rfidEntry);
  } catch (err) {
    console.error("Error creating RFID entry:", err);
    
    // If there's an error after file upload, delete the uploaded file
    if (req.file && req.file.path) {
      const filePath = path.join(__dirname, req.file.path);
      deleteFile(filePath); // Call helper function to delete the file
    }
    
    res.status(500).json({ error: err.message });
  }
});

// Get all RFID entries
app.get("/rfid", async (req, res) => {
  try {
    const rfidEntries = await RFID.findAll();
    res.json(rfidEntries);
  } catch (err) {
    console.error("Error fetching RFID entries:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get a specific RFID entry by ID
app.get("/rfid/:id", async (req, res) => {
  try {
    const rfidEntry = await RFID.findByPk(req.params.id);
    if (rfidEntry) {
      res.json(rfidEntry);
    } else {
      res.status(404).send("RFID entry not found");
    }
  } catch (err) {
    console.error("Error fetching RFID entry:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Update an RFID entry
app.put("/rfid/:id", upload.single("video"), async (req, res) => {
  try {
    const { rfidCode } = req.body;
    const videoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const [updated] = await RFID.update(
      { rfidCode, ...(videoUrl && { videoUrl }) },
      { where: { id: req.params.id } }
    );
    if (updated) {
      const updatedRFID = await RFID.findByPk(req.params.id);
      res.json(updatedRFID);
    } else {
      res.status(404).send("RFID entry not found");
    }
  } catch (err) {
    console.error("Error updating RFID entry:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete an RFID entry
app.delete("/rfid/:id", async (req, res) => {
  try {
    const deleted = await RFID.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).send("RFID entry deleted");
    } else {
      res.status(404).send("RFID entry not found");
    }
  } catch (err) {
    console.error("Error deleting RFID entry:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
