const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Use UUID to generate unique IDs

const app = express();
const port = 5001;
const dataFilePath = path.join(__dirname, "data.json");

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// Helper functions
const loadData = () => {
  try {
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    // If file is empty or invalid, return an empty structure
    return { rfidEntries: [] };
  }
};

const saveData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Multer setup for file uploads with custom filename using the generated UUID
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const rfidId = uuidv4();
    req.rfidId = rfidId;
    const fileExtension = path.extname(file.originalname);
    cb(null, `${rfidId}${fileExtension}`);
  },
});
const upload = multer({ storage });

// Create a new RFID entry and upload a video
app.post("/rfid", upload.single("video"), (req, res) => {
  try {
    const { rfidCode } = req.body;
    const videoUrl = `/uploads/${req.file.filename}`;

    // Load existing data
    const data = loadData();

    // Check for duplicate rfidCode
    const existingRFID = data.rfidEntries.find(
      (entry) => entry.rfidCode === rfidCode
    );
    if (existingRFID) {
      return res.status(400).json({ error: "RFID code already exists" });
    }

    // Create new RFID entry
    const newEntry = {
      id: req.rfidId,
      rfidCode,
      videoUrl,
    };

    // Save entry to data.json
    data.rfidEntries.push(newEntry);
    saveData(data);

    res.json(newEntry);
  } catch (err) {
    console.error("Error creating RFID entry:", err);
    if (req.file && req.file.path) {
      const filePath = path.join(__dirname, req.file.path);
      deleteFile(filePath);
    }
    res.status(500).json({ error: err.message });
  }
});

// Update an RFID entry
app.put("/rfid/:id", upload.single("video"), (req, res) => {
  try {
    const { rfidCode } = req.body;
    const videoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const data = loadData();
    const entryIndex = data.rfidEntries.findIndex(
      (entry) => entry.id === req.params.id
    );

    if (entryIndex === -1) {
      return res.status(404).send("RFID entry not found");
    }

    // Check if another entry already uses the updated rfidCode
    const existingRFID = data.rfidEntries.find(
      (entry) => entry.rfidCode === rfidCode && entry.id !== req.params.id
    );
    if (existingRFID) {
      return res.status(400).json({ error: "RFID code already exists" });
    }

    const updatedEntry = {
      ...data.rfidEntries[entryIndex],
      rfidCode,
      ...(videoUrl && { videoUrl }),
    };
    data.rfidEntries[entryIndex] = updatedEntry;
    saveData(data);
    res.json(updatedEntry);
  } catch (err) {
    console.error("Error updating RFID entry:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get all RFID entries
app.get("/rfid", (req, res) => {
  try {
    const data = loadData();
    res.json(data.rfidEntries);
  } catch (err) {
    console.error("Error fetching RFID entries:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get a specific RFID entry by ID
app.get("/rfid/:id", (req, res) => {
  try {
    const data = loadData();
    const rfidEntry = data.rfidEntries.find(
      (entry) => entry.id === req.params.id
    );
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

// Delete an RFID entry
app.delete("/rfid/:id", (req, res) => {
  try {
    const data = loadData();
    const entryIndex = data.rfidEntries.findIndex(
      (entry) => entry.id === req.params.id
    );

    if (entryIndex !== -1) {
      const [deletedEntry] = data.rfidEntries.splice(entryIndex, 1);
      saveData(data);

      // Delete associated video file
      const filePath = path.join(__dirname, deletedEntry.videoUrl);
      deleteFile(filePath);

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
