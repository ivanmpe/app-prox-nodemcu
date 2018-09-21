import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  data = [];
  public redes = []

  constructor(public navCtrl: NavController, private hotspot: Hotspot) {
    setInterval(() => {
      this.rescan();
    }, 2000);
  }
  ionViewDidLoad() {
    this.rescan();
  }
  rescan() {
    this.hotspot.scanWifiByLevel().then((networks: Array<HotspotNetwork>) => {
      this.data = networks;
    })
  }

}
