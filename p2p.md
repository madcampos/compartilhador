Técnicas de compartilhamento de arquivos
===

Para poder realizar o compartilhamento entre duas partes é necessário que ambas tenham acesso ao endereço externo da outra. Ou seja, passem sobre o NAT.
As técnicas para realizar isso são chamadas de [`hole punching`](http://en.wikipedia.org/wiki/Hole_punching). Entre elas temos as opções:

1. UPnP
	- https://github.com/indutny/node-nat-upnp 
2. NAT-PMP
	- https://github.com/level451/pmp
	- https://github.com/TooTallNate/node-nat-pmp
3. ICE
	- https://www.npmjs.com/package/zeroc-icejs
	- https://www.npmjs.com/package/libnice
4. TeleHash
	- https://github.com/mnaamani/node-telehash
5. STUN
	- https://www.npmjs.com/package/vs-stun
6. WebRTC
	- https://www.npmjs.com/package/peerconnection
	- https://github.com/js-platform/node-webrtc
	- https://www.npmjs.com/package/skyrtc
	- https://www.npmjs.com/package/easyrtc
	- https://www.npmjs.com/package/rtcpeerconnection
	- http://simplewebrtc.com/