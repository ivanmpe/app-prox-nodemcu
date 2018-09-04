import { Component } from '@angular/core';
import { AlertController, NavController, Platform } from 'ionic-angular';
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  data: any;
  constructor(private platform: Platform, public navCtrl: NavController, private hotspot: Hotspot, public alertCtrl: AlertController) {
    this.platform.registerBackButtonAction(() => {
      
    });
  }

  ionViewDidLoad() {
    this.hotspot.scanWifiByLevel().then((networks: Array<HotspotNetwork>) => {
      this.data = networks;
      var ue = this.data.level;
      console.log(".........hotspot..........", JSON.stringify(networks));
    });
  }

  pass(SSID) {

    let prompt = this.alertCtrl.create({
      title: SSID,
      message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: Password => {

            console.log("password", Password.title, SSID);
            this.hotspot.connectToWifi(SSID, Password)
              .then((data) => {

                console.log(".........hotspot..........", data);
              }, (error) => {
                console.log(".........hotspot..........", error);
              })

          }
        }
      ]
    });
    prompt.present();
  }
}