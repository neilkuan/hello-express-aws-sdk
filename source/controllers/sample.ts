import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import { STS } from '@aws-sdk/client-sts';
import { fromInstanceMetadata, fromContainerMetadata } from '@aws-sdk/credential-providers';

const NAMESPACE = 'Sample Controller';

const sampleHealthCheck = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Sample health check route called.');
    return res.status(200).json({
        message: 'pong'
    });
};
const sampleHelloWorld = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Sample hello check route called.');
    return res.status(200).json({
        message: 'hi!!!'
    });
};

const whoAmI = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Sample AWS STS route called.');
    let sts: STS;
    let iamRole = '';
    if (process.env.RUNTIME === 'EC2') {
        console.log('AWS STS is using instance metadata.');
        sts = new STS({
            credentials: fromInstanceMetadata({
                timeout: 1000,
                maxRetries: 2
            })
        });
    } else if (process.env.RUNTIME === 'ECS') {
        console.log('AWS STS is using instance metadata.');
        sts = new STS({
            credentials: fromContainerMetadata({
                timeout: 1000,
                maxRetries: 2
            })
        });
    } else {
        sts = new STS({});
    }
    try {
        const data = await sts.getCallerIdentity({});
        iamRole = `${data.Arn}`;

        return res.status(200).json({
            message: 'You are authenticated as ' + iamRole
        });
    } catch (err) {
        return res.status(200).json({
            message: `I am ${iamRole}`
        });
    }
};

export default { sampleHealthCheck, sampleHelloWorld, whoAmI };
