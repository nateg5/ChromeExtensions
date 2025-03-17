#!/bin/bash

for (( ; ; ))
do

	for (( ; ; ))
	do
	
		sleep 3600
		now=$(date +"%H%M%S");
		
		if [ $now -lt "010000" ]; then
		
			chromium "https://www.amazon.com/s?k=laptop&crid=1BONC12GPA73D&sprefix=laptop%2Caps%2C279" &
			sleep 60
			pkill chromium
			break
		
		fi
	
	done

	for (( ; ; ))
	do
	
		sleep 60
		now=$(date +"%H%M%S");
		
		if [ $now -lt "010000" ]; then
		
			chromium "https://www.amazon.com/Best-Sellers-Computers-Accessories-Laptop-Computers/zgbs/pc/565108/ref=zg_bs_nav_pc_1" &
			sleep 60
			pkill chromium
			break
		
		fi
	
	done
	
done
