# simpleVideoStream
simple node/react video/audio remote streaming service

I mainly use this to stream movies from PC to Tablet.

# Usage

put video/audio files in the 'data' directory of the 'back' server. 
make sure the proxy used by the frontend server (inside package.json) redirects to the backend server's ip/port.
Start both 'back' and 'front' and access web page:
 - http://localhost:3000 (on local machine)
 - http://frontendServerIp:3000 (remote access)
