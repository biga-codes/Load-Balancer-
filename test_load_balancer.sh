#this file contains the code to send several requests to my load balancer pgm

#number of requests to send
REQUESTS=10

#URL of my loadbalancer for implemetation
URL="http://localhost:8000"

#sending requests using a for loop
for ((i=1; i<=$REQUESTS; i++))
do
    echo "Request #$i:"
    curl -v $URL
    echo
done


#to make script executable you have to type chmod +x test_load_balancer.sh in the terminal
#to run the script you have to type ./test_load_balancer.sh in the terminal