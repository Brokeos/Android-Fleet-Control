import winston from 'winston';
import path from 'path';

import DailyRotateFile = require("winston-daily-rotate-file");
const logDirectory = path.resolve(__dirname, '../../log');

const maxSize = '5m'; // Taille maximale du fichier de logs avant la rotation

const transport = new DailyRotateFile({
  filename: `${logDirectory}/%DATE%-logs.log`,
  datePattern: 'YYYY-MM-DD',
  maxSize: maxSize,
  maxFiles: '7d' // Conserver les fichiers de logs pendant 7 jours
});

const logger = winston.createLogger({
  format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
      winston.format.printf(info => info.timestamp +"|"
      +info.level.replace(/[^[\]\w\sÀ-ÿ\/.,?!'’]|(?<!\[)\[+/g, '').replace(/3.{1}m/g, '')
      +"|"+info.message.replace(/[^[\]\w\sÀ-ÿ\/.,?!'’]|(?<!\[)\[+/g, '').replace(/3.{1}m/g, '')
      )
    ),
    transports: [transport]
});

export function getLogger(){
    return logger;
}
