#!/bin/bash
for i in {1..5}
do
   curl -o /dev/null -w "Connect: %{time_connect} TTFB: %{time_starttransfer} Total time: %{time_total} \n" https://www.realtor.com/realestateandhomes-search/San-Jose_CA?force_ab_variant=v,12,rr_v2
done
