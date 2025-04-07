import exp from 'constants';
import * as dotenv from 'dotenv';

dotenv.config();

export const boothID = process.env.BOOTHID;
export const key = process.env.KEY;
export const bcryptCostFactor = process.env.BCRYPTCOST