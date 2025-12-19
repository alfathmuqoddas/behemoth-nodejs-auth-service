import app from './app';
import sequelize from './config/database';
import dotenv from 'dotenv';
import logger from './config/logger';

dotenv.config();

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  logger.error('Unable to connect to the database:', error);
});
