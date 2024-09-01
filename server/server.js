import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/qrScanner', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose schema and model for QR codes
const qrSchema = new mongoose.Schema({
  code: String,
  createdAt: { type: Date, default: Date.now },
});

const QRCode = mongoose.model('QRCode', qrSchema);

// API route to handle QR code data
app.post('/api/qr', async (req, res) => {
  const { qrCode } = req.body;

  if (!qrCode) {
    return res.status(400).json({ message: 'QR code data is required' });
  }

  try {
    // Check if the QR code already exists
    const existingQRCode = await QRCode.findOne({ code: qrCode });
    if (existingQRCode) {
      return res.status(200).json({ message: 'QR code already exists', data: existingQRCode });
    }

    // Save the new QR code
    const newQRCode = new QRCode({ code: qrCode });
    await newQRCode.save();

    res.status(201).json({ message: 'QR code added', data: newQRCode });
  } catch (error) {
    console.error('Error handling QR code:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
