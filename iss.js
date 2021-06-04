/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  const link = 'https://api.ipify.org?format=json';
  request(link, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      const IP = JSON.parse(body).ip;
      // console.log(IP);
      callback(null, IP);
      return;
    }
    
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      // console.log(body);
      const latitude = JSON.parse(body).latitude;
      const longitude = JSON.parse(body).longitude;
      // console.log(latitude);
      // console.log(longitude);
      return callback(null, {latitude, longitude});
    }
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      // console.log(body);
      const pass = JSON.parse(body).response;
      // console.log(pass);
      return callback(null, pass);
    }
  });
};


const nextISSTimesForMyLocation = function(callback) {
  // empty for now
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    } else {
      fetchCoordsByIP(ip, (error, coord) => {
        if (error) {
          callback(error, null);
          return;
        } else { 
          fetchISSFlyOverTimes(coord, (error, pass) => {
            if (error) {
              callback(error, null);
              return;
            } else {
              return callback(null, pass);
            } 
          });
        } 
      });
    };
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};

