import { app } from './app.js';
import { connectDB, disconnectDB } from './shared/config/database.config.js';
import { Server } from 'http';

const PORT = process.env.PORT || 3000;

/**
 * shutdown handler
 */
const shutdownHandler = async (server: Server, signal: string): Promise<void> => {
  console.log(`\n${signal} received, shutting down gracefully...`);

  try {
    // Close HTTP server
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    console.log('✅ HTTP server closed');
    // Close database connection
    await disconnectDB();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Register shutdown handlers
    const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];
    signals.forEach((signal) => {
      process.on(signal, () => shutdownHandler(server, signal));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
