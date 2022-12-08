# UNOCSGradSchedulerWebApp
Final project for CSCI 5452 Cloud Computing. Small web app to assist scheduling of courses in the CS Master's Program at UNO.

Authors: Jober't Aladwan, Sara Basili, Kayla Nguyen

This application is made to be deployed with AWS EB CLI. If you do not already have it installed, please visit
https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html
https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-configuration.html

and set up your project directory to use the Node.js platform

## HOW TO DEPLOY:

First, locate your base.cfg.yml file included in the app.zip folder inside of .elasticbeanstalk.
At the section below, please replace ```email``` with the email address of where you would like to receive notifications regarding your environment's health.
```
aws:elasticbeanstalk:sns:topics:
    Notification Endpoint: email
```
Your application is now ready to deploy using AWS EB CLI

To deploy this application using the AWS Elastic Beanstalk service, navigate to the folder containing your configured EB CLI directory in your
terminal and run the following command:

```
eb create --cfg base
```

A new environment will be created for your application with a preconfigured load balancer, database, and other required AWS services.
