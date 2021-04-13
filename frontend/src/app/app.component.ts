import { Component } from '@angular/core';
import { ethers, providers, Contract } from 'ethers';
import PaymentProcessor from '../../../artifacts/contracts/PaymentProcessor.sol/PaymentProcessor.json';
import Dai from '../../../artifacts/contracts/Dai.sol/Dai.json';
import { BackendService } from './services/backend.service';

declare const window: any;
const pp_address = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const dai_address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const ITEMS = [
  {
    id: 1,
    price: ethers.utils.parseEther('1')
  },
  {
    id: 2,
    price: ethers.utils.parseEther('3')
  },
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private backendService: BackendService) { }
  downloadUrl = 'Choose a product to download';
  contracts: any = [];

  async buy(n: number) {
    this.backendService.getPaymentId(ITEMS[n].id.toString()).subscribe(async res => {

      const [paymentProcessor, dai] = this.contracts;
      const tx1 = await dai.approve(paymentProcessor.address, ITEMS[n].price);
      await tx1.wait();

      const tx2 = await paymentProcessor.pay(ITEMS[n].price, res.paymentId);
      await tx2.wait();

      await new Promise(resolve => setTimeout(resolve, 5000));
      this.backendService.getDownloadbleUrl(res.paymentId).subscribe(r => {
        this.downloadUrl = r.url
      })
    });
  }

  ngOnInit() {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        await window.ethereum.enable();
        const provider = new providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();
        const paymentProcessor = new Contract(
          pp_address,
          PaymentProcessor.abi,
          signer
        );

        this.contracts.push(paymentProcessor)

        const dai = new Contract(
          dai_address,
          Dai.abi,
          signer
        );

        this.contracts.push(dai)
      }
    });

  }
}
