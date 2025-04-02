#!/bin/bash

for (( ; ; ))
do

	for (( ; ; ))
	do
	
		sleep 3600
		now=$(date +"%H%M%S");
		
		if [ $now -lt "010000" ]; then
		
			chromium "https://www.amazon.com/gp/browse.html?node=541966&ref_=nav_em__pc_ce_0_2_16_4" &
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
		
			chromium "https://www.amazon.com/gp/browse.html?rw_useCurrentProtocol=1&node=565108&ref_=amb_link_BpW_pJfGS-SH8sCy2LOykw_2" &
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
		
			chromium "https://www.amazon.com/s?i=computers&rh=n%3A565108&s=popularity-rank&fs=true&ref=lp_565108_sar" &
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
		
			chromium "https://www.amazon.com/gp/bestsellers/?ref_=nav_cs_bestsellers" &
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
		
			chromium "https://www.amazon.com/Best-Sellers-Computers-Accessories/zgbs/pc/ref=zg_bs_nav_pc_0" &
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

	for (( ; ; ))
	do
	
		sleep 60
		now=$(date +"%H%M%S");
		
		if [ $now -lt "010000" ]; then
		
			chromium "https://www.amazon.com/s?k=laptop&crid=3J32AHH9V4BEX&sprefix=laptop%2Caps%2C239&ref=nb_sb_noss_1" &
			sleep 60
			pkill chromium
			break
		
		fi
	
	done
	
done
