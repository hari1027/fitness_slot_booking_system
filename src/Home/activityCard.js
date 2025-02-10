import React from 'react';
import './activityCard.css'; 
import { useParams  } from 'react-router-dom';

const ActivityCard = ({ name, slotsAvailable, waitlistNumber, icon, bookedIds, waitlistIds , timing , getClasses }) => {
  const { userId } = useParams();
  const isBooked = bookedIds.includes(userId);
  const isInWaitlist = waitlistIds.includes(userId);
  const isFull = (slotsAvailable <= 0)? true : false
  
  const userWaitlistPosition = isInWaitlist ? waitlistIds.indexOf(userId) + 1 : null;

  const isCancelNotAllowed = () => {
    const currentTime = new Date();
    const classStartTime = new Date(`${timing?.date} ${timing?.startTime}`);
    classStartTime.setMinutes(classStartTime.getMinutes() - 30);
    return currentTime > classStartTime;
  };

  const handleBookNow = async (name) => {
    let requestData ={
        userId: userId,
        classId : name === "Yoga" ? 1 : name === "Gym" ? 2 : 3
    }
    const response = await fetch('https://fitness-booking-backend-production.up.railway.app/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      console.log(result)
      if (result.status) {
        getClasses()
      }
  };

  const handleCancelSlot = async (name) => {
    let requestData ={
        userId: userId,
        classId : name === "Yoga" ? 1 : name === "Gym" ? 2 : 3
    }
    const response = await fetch('https://fitness-booking-backend-production.up.railway.app/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      console.log(result)
      if (result.status) {
        getClasses()
      }
  };

  return (
    <div className="activity-card">
      <div className="icon-container">
        <img src={icon} alt={name} className="activity-icon" />
      </div>
      <div className="card-content">
        <h2>{name}</h2>
    <div style={{display:"flex" , flexDirection:'row', justifyContent:"space-between"}}>
      <div style = {{paddingLeft:"10px" ,width:"45%"}}>
        {isBooked ? <p>Booked</p> : (!isBooked && !isFull) ?  <p>{`Slots Available: ${slotsAvailable}`}</p> :(isFull && !isInWaitlist)?<p>{`Waiting List: ${waitlistNumber}`}</p>: isInWaitlist ?  <p>{`Your waitlist position: ${userWaitlistPosition}`}</p> : null}

        <div className="button-container">
          {!isBooked && !isInWaitlist && (
            <button
              className={`book-btn ${isFull ? 'waiting' : ''}`}
              onClick={() => {handleBookNow(name)}}
            >
              {isFull ? 'Join Waiting List' : 'Book Now'}
            </button>
          )}
          
          {(isBooked || isInWaitlist) && !isCancelNotAllowed() && (
            <button 
              className="cancel-btn"
              onClick={() => {handleCancelSlot(name)}}
            >
              Cancel Slot
            </button>
          )}
          {isCancelNotAllowed() && 
            <div className='cancelNotAllowdedText'>
              Cancel is not allowed if class start time is less than 30 mins 
            </div>
          }
        </div>
      </div>
      <div style = {{paddingRight:"10px" , width:"45%"}}>
            <p>{`Date: ${timing?.date || 'N/A'}`}</p>
            <p>{`Start Time: ${timing?.startTime || 'N/A'}`}</p>
            <p>{`End Time: ${timing?.endTime || 'N/A'}`}</p>
      </div>
    </div>
      </div>
    </div>
  );
};

export default ActivityCard;
