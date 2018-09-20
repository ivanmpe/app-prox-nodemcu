import { Component } from '@angular/core';
import {  NavController, Platform } from 'ionic-angular';
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot';
import { Paho } from 'ng2-mqtt/mqttws31';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


 
  client;
  status: String = "MQTT DISCONECTADO"
  statusMqtt: Boolean = false;
  host = 'm13.cloudmqtt.com';
  path = '/mqtt';
  port = 33728;
  
  options = {
    useSSL: true,
    userName: "xmvxeajy",
    password: "_rdhkvlq9-aB",
    onSuccess: this.onConnected.bind(this)
  }

  data = [];
  levelNodemcu1: number;
  distanceNodemcu1: number =0; 

 

  constructor(private platform: Platform, public navCtrl: NavController, private hotspot: Hotspot,
    public toastCtrl: ToastController) {
      setInterval(() => { 
        this.rescan(); 
     }, 2000);
    }

  ionViewDidLoad() {
    this.client = new Paho.MQTT.Client(this.host, this.port, this.path);
    this.client.connect(this.options);
  }


  subscribe() {
    var topic = "nodemcu1/led";
    var qos = 0;
    this.client.subscribe(topic, { qos: qos });
  }

  onConnected() {
    this.subscribe();
    this.statusMqtt = true;
    this.status = "MQTT CONECTADO"
    this.presentToast('mqtt conectado');
  }

  sendMessage(message: string) {
    let packet = new Paho.MQTT.Message(message);
    packet.destinationName = "nodemcu1/led";
    this.client.send(packet);
  }


  onMessage() {
      this.client.onMessageArrived = (message: Paho.MQTT.Message) => {
      console.log("Message Arrived: " + message.payloadString);
      console.log("Topic: " + message.destinationName);
      console.log("QoS: " + message.qos);
      console.log("Retained: " + message.retained);
    };
  }


  onConnectionLost() {
    this.client.onConnectionLost = (responseObject: Object) => {
      this.presentToast('Connection lost : ' + JSON.stringify(responseObject));
      console.log('Connection lost : ' + JSON.stringify(responseObject));
    };
    this.status = "MQTT DISCONECTADO";  
    this.statusMqtt = false;
  }

  presentToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }


  rescan() {
    this.hotspot.scanWifiByLevel().then((networks: Array<HotspotNetwork>) => {

      this.data = networks;
      var i: number;
      for (i = 0; i < this.data.length - 1; i++) {
        if (this.data[i].BSSID == '2e:3a:e8:08:e9:d0') {
         
          this.levelNodemcu1 =parseFloat(this.data[i].level);
          this.distanceNodemcu1 = Math.pow(10,((-54-(this.levelNodemcu1))/(10*2)));
          this.distanceNodemcu1 = parseFloat(this.distanceNodemcu1.toFixed(2))

          if (this.distanceNodemcu1 < 3.00 ) {
            this.sendMessage("1");
          } else {
            this.sendMessage("0");
          }
        }
    }
      

    })

  }


}

/*
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
      }*/
