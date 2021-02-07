
#!/usr/bin/env bash

targetDirectories=(".aws-sam/build/ProcessMessageNotificationsFunction" ".aws-sam/build/SendEmailSESFunction" ".aws-sam/build/SesBouncesFunction" ".aws-sam/build/SesComplaintsFunction")

for i in "${targetDirectories[@]}"
  do
     mkdir $i/config
     cp -rf config/ $i/config
 done