import express from 'express';
import routes from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// Main application routes
app.use('/', routes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected error occurred on the server.' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  POST http://localhost:${PORT}/register`);
  console.log(`  POST http://localhost:${PORT}/login`);
  console.log(`  POST http://localhost:${PORT}/checkout (Protected)`);
  console.log(`  GET  http://localhost:${PORT}/healthcheck`);
});

export default app;
