+++
title = "Summary and Clean Up"
chapter = false
weight = 1
+++

### Our Goal

What you have done!
![Stocks Worshop Application](/images/architecture/Arch5.png)

### Clean Up

To clean up the lab run the following in Cloud 9 console

```bash
cd ~/environment/resttogql-workshop/src/infrastructure

cdk destroy
```

### Finish CleanUp

1. Open up the AWS Console
2. Go To the AppSync Service
3. Select the API you created manually earlier ( the radio button)
4. Select 'Delete'
5. Next Go to the Cloud 9 service
6. Select the enviroment you created earlier
7. Select 'Delete'
8. Optional - You can also delete the S3 staging bucket used to provision the environment


