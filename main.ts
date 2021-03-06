/*
* pxt-iot-lora node, Micro:Bit library for IoTLoRaNode
* Copyright (C) 2018  Pi Supply

* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

enum Channels {
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9

}
enum SpreadingFactors {
    Seven = 5,
    Eight = 4,
    Nine = 3,
    Ten = 2,
    Eleven = 1,
    Twelve = 0

}


//% weight=10 color=#8bc34a icon="\uf1eb"


namespace IotLoRaNode {
    serial.redirect(SerialPin.P14, SerialPin.P15, BaudRate.BaudRate115200);
    let payload = ""

    //%blockId="IotLoRaNode_InitialiseRadio" block="Initialise LoRa Radio:|Device Address %deviceaddress|Network Session Key %netswk|App Session Key %appswk|SF %datarate"
    //% blockGap=8
    export function InitialiseRadio(devaddress: string, netswk: string, appswk: string, datarate: SpreadingFactors): void {
        /**
        * First we need to configure the serial port to use the pins and reset the radio
        */
        pins.digitalWritePin(DigitalPin.P16, 1)
        basic.pause(100)
        pins.digitalWritePin(DigitalPin.P16, 0)
        serial.readLine()

        /**
         * For this we are only going to use ABP & LoRa WAN Modes for now
         */

        //Set to use LoRaWAN Mode
        serial.writeString("at+mode=0\r\n");
        serial.readLine()
        //Set Device Address
        serial.writeString("at+set_config=dev_addr:" + devaddress + "\r\n");
        serial.readLine()
        //Set the network session key
        serial.writeString("at+set_config=nwks_key:" + netswk + "\r\n");
        serial.readLine()
        //Set the application session key
        serial.writeString("at+set_config=apps_key:" + appswk + "\r\n");
        serial.readLine()
        //Set the data rate
        serial.writeString("at+set_config=dr:" + datarate + "\r\n");
        serial.readLine()
        //"Join" the LoRaWAN Network in ABP Mode
        serial.writeString("at+join=abp\r\n");
        serial.readLine()
        //Display on the screen that LoRa is ready.
        basic.showString("LoRa Ready")


    }
    //%blockId="IotLoRaNode_DigitalValue"
    //%block="Add Digital Value: %value on channel: %chanNum"
    export function DigitalValue(value: boolean, chanNum: Channels): void {
        /**
         * Add digital value
         */
        let intVal = value ? 1 : 0;
        payload = payload + "0" + chanNum + "000" + intVal;

    }
    //%blockId="IotLoRaNode_AnalogueValue" block="Add Analogue Value: %value on channel: %chanNum"
    //% value.min=0 value.max=254
    export function AnalogueValue(value: number, chanNum: Channels): void {
        /**
         * Add analogue value
         */
        let bufr = pins.createBuffer(2);
        bufr.setNumber(NumberFormat.Int16BE, 0, (value * 100))

        payload = payload + "0" + chanNum + "02" + bufr.toHex();


    }

    //%blockId="IotLoRaNode_tempertureValue" block="Add Temperature Value: $temperatureVal to channel: %id"
    export function TempertureValue(temperatureVal: number, chanNum: Channels): void {
        /**
         * Add temperature value
         */
        let bufr = pins.createBuffer(2);
        bufr.setNumber(NumberFormat.Int16BE, 0, (temperatureVal * 10))

        payload = payload + "0" + chanNum + "67" + bufr.toHex();


    }
    //%blockId="IotLoRaNode_HumidityValue" block="Add Humidity Value: $humidityVal to channel: %id"
    //%advanced=true
    export function HumidityValue(humidityVal: number, chanNum: Channels): void {
        /**
         * Add humidity value
         */
        let bufr = pins.createBuffer(2);
        bufr.setNumber(NumberFormat.Int16BE, 0, (humidityVal * 100))

        payload = payload + "0" + chanNum + "68" + bufr.toHex();


    }
    /**
    * //%blockId="IotLoRaNode_AccelorometerValue" block="Add Accelerometer Value: $accelVal to channel: %id"
    *export function AccelorometerValue(accelVal: number, chanNum: channels): void {
    *    /**
    *     * Add accelorometer
         *
    *    let bufr = pins.createBuffer(2);
    *    bufr.setNumber(NumberFormat.Int16BE, 0, (accelVal * 100))
    *
    *   payload = payload + "0" + chanNum + "02" + bufr.toHex();
    *
    *}
    **/

    //%blockId="IotLoRaNode_LightValue" block="Add light Value: $lightVal on channel: %id"
    export function LightValue(lightVal: number, chanNum: Channels): void {
        /**
         * Add light value
         */
        let bufr = pins.createBuffer(2);
        bufr.setNumber(NumberFormat.Int16BE, 0, (lightVal))

        payload = payload + "0" + chanNum + "65" + bufr.toHex();

    }
    //%blockId="IotLoRaNode_TransmitMessage" block="Transmit LoRa Data"
    export function loraTransmitPayload(): void {
        /**
         * Transmit Message
         */

        serial.writeString("at+send=0,1," + payload + "\r\n");
        basic.showString(serial.readUntil(serial.delimiters(Delimiters.NewLine)))
        basic.showString(serial.readUntil(serial.delimiters(Delimiters.NewLine)))
        payload = ""
    }


}
