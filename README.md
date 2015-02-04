# owntracks-logger #
owntracks-logger is a nodejs-based utility application that subscribes to a topic on an MQTT broker having updates sent to by [OwnTracks](http://owntracks.org/) and then stores location updates to a MongoDB database backend.

### Configuration ###
All configuration parameters are specified as environment variables.

`MQTT_URL` specifies the MQTT broker to use. Please see [this](https://www.npmjs.com/package/mqtt#mqttconnecturl-options) for instructions on how to specify this URL.  
`MQTT_TOPIC` specifies the topic to subscribe to for updates. Wildcards (#, +) are also accepted.  
`MQTT_CLIENT_ID` The client ID to use when connecting to the MQTT broker.  
`MONGO_URL` the URL specification for the MongoDB instance to use. Please see [this](https://www.npmjs.com/package/mongodb#introduction) for an example on how to specify this option.

### Dockerfile ###

    FROM dockerfile/nodejs
    MAINTAINER Tim Akinbo <takinbo@gmail.com>
    
    ADD index.js /app/
    ADD package.json /app/
    WORKDIR /app/
    RUN npm install
    
    CMD npm start
