const os = require('os')
const ifaces = os.networkInterfaces()

const fetch = require('sync-fetch')

const metadata = fetch('https://api.ipify.org?format=json', {
  headers: {
    Accept: 'application/json'
  }
}).json()
// json(), arrayBuffer(), text() and buffer() supported
// const getLocalIp = () => {
//   let localIp = '127.0.0.1'
//   Object.keys(ifaces).forEach((ifname) => {
//     for (const iface of ifaces[ifname]) {
//       // Ignore IPv6 and 127.0.0.1
//       if (iface.family !== 'IPv4' || iface.internal !== false) {
//         continue
//       }
//       // Set the local ip to the first IPv4 address found and exit the loop
//       localIp = iface.address
//       return
//     }
//   })
//   return localIp
// }


// Example usage:
const publicIP = metadata.ip;
if (publicIP) {
  console.log('Public IP address:', publicIP);
} else {
  console.error('Failed to fetch public IP address');
}

module.exports = {
  listenIp: '0.0.0.0',
  listenPort: 3016,
  sslCrt: '../ssl/cert.pem',
  sslKey: '../ssl/key.pem',

  mediasoup: {
    // Worker settings
    numWorkers: Object.keys(os.cpus()).length,
    worker: {
      rtcMinPort: 10000,
      rtcMaxPort: 10100,
      logLevel: 'warn',
      logTags: [
        'info',
        'ice',
        'dtls',
        'rtp',
        'srtp',
        'rtcp'
        // 'rtx',
        // 'bwe',
        // 'score',
        // 'simulcast',
        // 'svc'
      ]
    },
    // Router settings
    router: {
      mediaCodecs: [
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2
        },
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          parameters: {
            'x-google-start-bitrate': 1000
          }
        }
      ]
    },
    // WebRtcTransport settings
    webRtcTransport: {
      listenIps: [
        {
          ip: '0.0.0.0',
          // announcedIp: getLocalIp() // replace by public IP address
          announcedIp: publicIP // replace by public IP address
        }
      ],
      maxIncomingBitrate: 1500000,
      initialAvailableOutgoingBitrate: 1000000
    }
  }
}
