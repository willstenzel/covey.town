### Design Changes     

#### Changes to the frontend    
###### Adding additional controls for TA

###### Adding functionality for a queue machine
The queue machine is a new Phaser object and is identified by its type QueueMachine, similar to how transporters are identified. The player     
can interact with the queue machine by standing near it and pressing the space key, similar to the transporters. The player will then be     
notified of their position in the queue and have their position in the queue displayed next to their name.

#### Changes to the backend   
###### Adding a Queue functionality for students
A Queue Class was made that is used to store students requests to join the queue when they interact with a queue machine.     
Queue:      
![alt text](https://github.com/willstenzel/covey.town/blob/master/docs/CRCCards/QueueCRC.png)

QueueTicket:        
![alt text](https://github.com/willstenzel/covey.town/blob/master/docs/CRCCards/QueueTicketCRC.png)

The queue can be interacted with from the front end through the use of the API cllients, similar to all the other functioanlities  
of covey.town. For the queue functionality, two new post requests can be made, one to join the queue and the second to allow the TA    
to help the next student in the queue. Consequently, there are also new handlers in the CoveyTownRequestHandler to handle these requests.  

The CoveyTownController will also have two new functions called by the handlers to allow a student to be added to the queue and to help     
the next student in the queue. Since, helping the next student also involves moving them to the designated location, the     
updatePlayerLocation function had to be modified to achieve this goal. An additional argument, force is used to mark    
movement updates that are teleportation to distinguish them from movement     
updates that are considered old and would otherwise be ignored.      
The diagram below depicts the changes made.     

![alt text](https://github.com/willstenzel/covey.town/blob/master/docs/office-hours-architecture.png)

###### Adding a functionality that distinguishes TAs from students
The player class has also been modified to have a new private boolean variable isTA, which is used to differentiate between TAs and Students.    
This field is set to true to indicate a Player that is a TA and the Player that created the room is designated as the TA in our implementation.  
The TA will have additional features and restrictions. The TA will have access to a help student button, which is used to transport the next    
studentin the queue and the TA to a private space. The TA is also unable to join the queue using the queue machine.
