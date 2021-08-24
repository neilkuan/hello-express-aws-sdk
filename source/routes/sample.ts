import express from 'express';
import controller from '../controllers/sample';

const router = express.Router();
router.get('/health', controller.sampleHealthCheck);
router.get('/hi', controller.sampleHelloWorld);
router.get('/whoami', controller.whoAmI);

export = router;
