import { useEffect, useState } from "react"
import ActivityCard from "./activityCard";
import YogaIcon from './yoga.png';
import GymIcon from './gym.png';
import DanceIcon from './dance.png';
import { useNavigate } from 'react-router-dom';
import './home.css'
import ClassesTable from "./table";

export default function Home(){
    const navigate = useNavigate();
    const [classes, setClasses] = useState([])

    const getClasses = async () =>{
        try {
            const response = await fetch('http://localhost:5000/classes', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            });
            const result = await response.json();
            console.log(result)
            if (result.status) {
                setClasses(result.classes)
            } 
          }
          catch (error) {
            console.error('Error while getting classes:', error);
          }
    }

    const handleLogout = () =>{
        navigate('/')
    }

    useEffect(()=>{
      getClasses()
    },[])

    return(
        <div className="home-container">
            <div className="card-container">
            {
                classes.map((activity) => {
                 return(
                    <ActivityCard
                    key={activity.type}
                    name={activity.type}
                    slotsAvailable={activity.slotsAvailable}
                    waitlistNumber={activity.waitlistNumber}
                    bookedIds={activity.bookedIds}
                    waitlistIds={activity.waitlistIds}
                    timing={activity.timing}
                    icon = {activity.type === "Yoga" ? YogaIcon : activity.type === "Gym" ? GymIcon : DanceIcon}
                    getClasses = {()=>getClasses()}
                  />
                 )
                })
            }
            </div>
            <div className="table">
                 <div className="tableHeader">Users Classes Overview</div>
                 <ClassesTable classes={classes} />
            </div>
            <button onClick={handleLogout} className={'logout'}>
                  Logout
            </button>
        </div>
    )
}