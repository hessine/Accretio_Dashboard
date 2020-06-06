etape1 : docker pull hessine/docker-dashboard:1.1
etape2 : docker run -p "6789:6789" -v "/var/run/docker.sock:/var/run/docker.sock" hessine/docker-dashboard:1.1

