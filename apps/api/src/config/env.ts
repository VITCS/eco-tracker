export const env = {
  PORT: Number(process.env.PORT || 4000),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://mongo:27017/ecotracker',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
};

