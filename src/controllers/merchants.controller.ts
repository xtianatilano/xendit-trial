import { Request, Response } from 'express';
import { AbstractController } from '../abstract/abstract.controller';
import { merchantRepository } from '../repositories/merchant-repository';

export default class MerchantsController extends AbstractController {
    public path = '/merchants';

    constructor() {
        super();
        this.initRoutes();
    }

    public initRoutes() {
        this.router.get(this.path, this.getMerchants.bind(this));
        this.router.patch(this.path + '/:merchantId(\\d+)/', this.patchMerchants.bind(this));
    }

    /**
     * @param req Request
     * @param res Response
     */
    public async getMerchants(req: Request, res: Response) {
        try {
            return this.ok(res, await merchantRepository.getMerchants());
        } catch (error) {
            return this.fail(res, error);
        }
    };

    /**
     * @param req Request
     * @param res Response
     */
    public async patchMerchants(req: Request, res: Response) {
        try {
            return this.ok(res, await merchantRepository.patchMerchant(req));
        } catch (error) {
            return this.fail(res, error);
        }
    };
}