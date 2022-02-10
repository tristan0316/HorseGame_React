import React from 'react'
import * as Progress from 'react-native-progress';

const Horse = (props) =>{

    return (
        <Progress.Bar progress={props.mile} width={200} />
    )   
}
export default Horse 


 // const [mile, setmile] = useState(0);

    // useEffect(() => {

    //     const timer = setTimeout(() => {
    //         console.log("Cuurent mile: " + mile)
    //         if(mile<20){
    //             console.log("Cuurent mile: " + mile)
    //         }
    //         else{
    //             return () => clearTimeout(timer);
    //         }
    //       }, 1000);
    //   });
