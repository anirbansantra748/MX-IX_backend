import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mx-ix-admin',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Admin defaults
  adminEmail: process.env.ADMIN_EMAIL || 'admin@mx-ix.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  
  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Grafana
  grafanaUrl: process.env.GRAFANA_URL || '',
  grafanaApiKey: process.env.GRAFANA_API_KEY || '',
  
  // Zabbix
  zabbixUrl: process.env.ZABBIX_URL || '',
  zabbixApiToken: process.env.ZABBIX_API_TOKEN || '',
  
  // Helpers
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default config;
