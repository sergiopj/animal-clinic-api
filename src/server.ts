import { app } from './app.js';
import { connectDB, disconnectDB } from './config/database.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🩺 Health check available at http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const signals = ['SIGTERM', 'SIGINT'];
    signals.forEach(signal => {
      process.on(signal, () => {
        console.log(`${signal} received, shutting down gracefully.`);
        server.close(() => {
          console.log('HTTP server closed.');
          disconnectDB().then(() => {
            console.log('Database connection closed.');
            process.exit(0);
          });
        });
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
