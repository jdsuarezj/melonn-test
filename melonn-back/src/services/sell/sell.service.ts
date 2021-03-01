import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { createOrderDTO, orderDTO } from '../../data/order.dto';

@Injectable()
export class SellService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async shippingMethods(id?: string) {
    const url = `https://yhua9e1l30.execute-api.us-east-1.amazonaws.com/sandbox/shipping-methods/${
      id ? id : ''
    }`;
    const data = await axios.get(url, {
      headers: {
        'x-api-key': process.env.API_KEY,
      },
    });

    return data.data;
  }

  public async offDays() {
    const url = `https://yhua9e1l30.execute-api.us-east-1.amazonaws.com/sandbox/off-days`;
    const data = await axios.get(url, {
      headers: {
        'x-api-key': process.env.API_KEY,
      },
    });

    return data.data;
  }

  public async orderById(sessionid: string, id: string): Promise<orderDTO[]> {
    const dataSession = await this.sessionOrderList(sessionid);
    let data = [];
    if (dataSession) {
      data = dataSession['userSession'].filter((_) => {
        return _.id === id;
      });
    }
    return data;
  }

  public async sessionOrderList(id: string): Promise<orderDTO[]> {
    return await this.cacheManager.get(id);
  }

  public async saveOrder(
    order: createOrderDTO,
    sessionid: string,
  ): Promise<any> {
    this.cacheManager.set(
      order.id,
      { ...order },
      { ttl: parseInt(process.env.TTL) },
      function (err) {
        if (err) throw err;
      },
    );

    const userSession = [];
    const dataSession = await this.sessionOrderList(sessionid);

    if (dataSession) {
      for (let i = 0; i < dataSession['userSession'].length; i++) {
        userSession.push(dataSession['userSession'][i]);
      }
    }
    userSession.push(order);

    this.cacheManager.set(
      sessionid,
      { userSession },
      { ttl: parseInt(process.env.TTL) },
      function (err) {
        if (err) throw err;
      },
    );

    return order.id;
  }
}
