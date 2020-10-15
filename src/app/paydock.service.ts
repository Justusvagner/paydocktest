import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { ChatMessage } from './form-data.type';

// would rather move it to env, but here it's not important
const privateKey = 'bcd7b567bc5569ee10cc1143b56735fb1f76b2bf';

const requestOptions = {
  headers: {
    'x-user-secret-key': privateKey,
    'Content-Type': 'application/json'
  },
};

const checkoutLink = 'https://api.paydock.com/v1/payment_sources/external_checkout';
const tokenLink = 'https://api-sandbox.paydock.com/v1/payment_sources/tokens';
const gatewayLink = 'https://api-sandbox.paydock.com/v1/gateways?limit=1&skip=1&sort_key=created_at&sort_direction=DESC';

const customerLink = 'https://api-sandbox.paydock.com/v1/customers';
const transferLink = 'https://api-sandbox.paydock.com/v1/transfers';

@Injectable({
  providedIn: 'root'
})
export class PaydockService {

  constructor(private http: HttpClient) { }

  main(formData: ChatMessage): void {

    // TODO remove
    const gatewayID = '5f8816f99909ae5f3ad40f16';

    const {
      amount,
      currency,
      description,
      reference,
      nameOnCard,
      cardNumber,
      expsec,
      seccvc,
      email,
      phone
    } = formData;

    const [ expMon, expYear ] = expsec.split('/');

    const customerBody = {
      first_name: nameOnCard,
      email,
      phone,
      payment_source: {
        gateway_id: gatewayID,
        card_name: nameOnCard,
        card_number: cardNumber,
        expire_month: expMon,
        expire_year: expYear,
        card_ccv: seccvc
      }
    };

    this.http.post(
      customerLink,
      customerBody,
      requestOptions
    ).pipe(
      switchMap((response: any) => {
        const customerId = response.resource.data._id;

        const transferBody = {
          reference,
          description,
          gateway_id: gatewayID,
          payouts: [
            {
              amount,
              currency,
              customer_id: customerId
            }
          ]
        };

        return this.http.post(
          transferLink,
          transferBody,
          requestOptions
        );
      })
    ).subscribe(console.log);
  }
}
