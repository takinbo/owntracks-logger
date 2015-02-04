var mqtt = require('mqtt');
var mongodb = require('mongodb');

var MONGO_URL = process.env.MONGO_URL || "mongodb://localhost/mqtt";
var MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883/";
var MQTT_CLIENT_ID = process.MQTT_CLIENT_ID || 'mqttjs_01';
var MQTT_TOPIC = process.env.MQTT_TOPIC;

mongodb.MongoClient.connect(MONGO_URL, function (err, db) {
    if (err) throw err;
    
    db.collection('owntracks', function (err, collection) {
        if (err) throw err;
        
        collection.ensureIndex({topic: 1, "events.loc": "2dsphere"}, function (err, index) {
            if (err) throw err;
            
            collection.ensureIndex({topic: 1, "events.ts": 1}, function (err, index) {
                if (err) throw err;
                
                collection.ensureIndex({topic: 1}, function (err, index) {
                    if (err) throw err;
                    
                    var client = mqtt.connect(MQTT_URL, {clean: false, clientId: MQTT_CLIENT_ID});
                    client.subscribe(MQTT_TOPIC);

                    client.on('message', function (topic, message) {
                        var msg = JSON.parse(message.toString());
                        if (msg._type === "location") {
                            var event = {};
                            event.loc = {};
                            event.loc.type = "Point";
                            event.loc.coordinates = [parseFloat(msg.lon), parseFloat(msg.lat)];
                            event.alt = parseFloat(msg.alt || 0);
                            if (msg.acc !== undefined) {
                                event.acc = parseFloat(msg.acc);
                            }
                            event.batt = parseFloat(msg.batt || 100);
                            if (msg.cog !== undefined) {
                                event.cog = parseFloat(msg.cog);
                            }
                            if (msg.desc !== undefined) {
                                event.desc = msg.desc;
                            }
                            if (msg.rad !== undefined) {
                                event.rad = parseFloat(msg.rad);
                            }
                            if (msg.t !== undefined) {
                                event.t = msg.t;
                            }
                            if (msg.tid !== undefined) {
                                event.tid = msg.tid;
                            }
                            event.ts = new Date(parseInt(msg.tst, 10) * 1000);
                            if (msg.vacc !== undefined) {
                                event.vacc = parseFloat(msg.vacc);
                            }
                            if (msg.vel !== undefined) {
                                event.vel = parseFloat(msg.vel);
                            }
                            collection.update({topic: topic}, {$addToSet: {events: event}}, {upsert: true, w:0});
                        }
                    });

                    client.on('error', function (error) {
                        // Do nothing, for now.
                    });
                });
            });
        });
    });
});
