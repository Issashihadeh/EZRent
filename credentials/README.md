# Credentials Folder

## The purpose of this folder is to store all credentials needed to log into your server and databases. This is important for many reasons. But the two most important reasons is
    1. Grading , servers and databases will be logged into to check code and functionality of application. Not changes will be unless directed and coordinated with the team.
    2. Help. If a class TA or class CTO needs to help a team with an issue, this folder will help facilitate this giving the TA or CTO all needed info AND instructions for logging into your team's server. 


# Below is a list of items required. Missing items will causes points to be deducted from multiple milestone submissions.

1. Server URL or IP: ec2-184-169-191-243.us-west-1.compute.amazonaws.com
2. SSH username: ubuntu
3. SSH password or key.
    Using SSH key "csc648-team4.pem"
    <br> If a ssh key is used please upload the key to the credentials folder.
4. Database URL or IP and port used.
    URL: database-csc648-team4.cwpgbxyiuu7u.us-west-1.rds.amazonaws.com
    Port: 3306
    <br><strong> NOTE THIS DOES NOT MEAN YOUR DATABASE NEEDS A PUBLIC FACING PORT.</strong> But knowing the IP and port number will help with SSH tunneling into the database. The default port is more than sufficient for this class.
5. Database username: team4_db_admin
6. Database password: Csc648-team4
7. Database name: mydb
8. Clear instructions with examples on how to use all the above information.

    - Open MySQL Workbench application, clicking the plus sign (+). A Setup New Connection tab open
    - When a tab open, navigate to <strong>Connection Method</strong>, choose "Standard TCP/IP over SSH" then fill out all the informations above. For the SSH key, click (...) icon and use the "csc648-team4.cer" key that is in with the credentials folder. <br><strong>NOTE</strong>: Connection name can be any of yours choice.
    - After filling out all the information, click <strong>Test Connection</strong>. If successfull connection, continue clicking <strong>Ok</strong>, then you are in the database UI. In the left tab, choose <strong>Schemas</strong> and right lick <strong>landlord-app</strong> and choose <strong>Set as Default Schema</strong>.
    - <strong>NOTE</strong>: If the connection is unsuccessfull, check the information again, if the problem still occur, contract team leader for assistance. 

# Most important things to Remember
## These values need to kept update to date throughout the semester. <br>
## <strong>Failure to do so will result it points be deducted from milestone submissions.</strong><br>
## You may store the most of the above in this README.md file. DO NOT Store the SSH key or any keys in this README.md file.
