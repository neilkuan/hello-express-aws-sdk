import http from 'http';
import express from 'express';
import bodyPaster from 'body-parser';
import logging from './config/logging';
import config from './config/config';
import sampleRouter from './routes/sample';

const NAMESPACE = 'Server';
const router = express();

/**
 * Logging the request.
 */
router.use((req: any, res: any, next: any) => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(
            NAMESPACE,
            `METHOD - [${req.method}], URL - [${req.url}], IP - 
  [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
        );
    });
    next();
});

/**
 * Parse the request.
 */
router.use(bodyPaster.urlencoded({ extended: false }));
router.use(bodyPaster.json());

/**
 * Rules of our API.
 */
router.use((req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Motheds', 'GET PATCH DELETE POST PUT');
        return res.status(200).json({});
    }
    next();
});

/** Routers */
router.use('/sample', sampleRouter);

/** Error Handling */
router.use((req: any, res: any, next: any) => {
    const error = new Error('not Found');
    return res.status(404).json({
        message: error.message
    });
});

/** Create the Server  */
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `SERVER is running on ${config.server.hostname}:${config.server.port}`));
