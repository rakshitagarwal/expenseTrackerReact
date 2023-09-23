import axios from "axios";
import { useRef, useState } from "react";
import { Card, Form,Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const PasswordChangePage = () => {
    const [isLoading,setIsLoading]=useState(false);
    const emailInputRef=useRef();

    const passwordChangeHandler=async(event)=>{
        event.preventDefault();
        const enteredEmail=emailInputRef.current.value
        setIsLoading(true)
        try{
            const response=await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyD-jRUm-dDo3xmPnrSwylPoLvNHMamvWXs',{
                requestType:"PASSWORD_RESET",
                email:enteredEmail,
            })
            console.log(response)
            setIsLoading(false);
        }catch(error){
            alert(error.response.data.error.message)
            setIsLoading(false)
        }
    }
  return (
    <Card style={{width:'25rem',margin:'auto',marginTop:'10vh',padding:'2rem'}}>
      <Form onSubmit={passwordChangeHandler}>
        <Form.Group className="mb-3 fw-bold">
          <Form.Label >Enter the email with which you have registered</Form.Label>
          <Form.Control type="email" placeholder="Enter email" required ref={emailInputRef}/>
        </Form.Group>
        <Button variant="primary" size="lg" type="submit">
        {isLoading ? 'Loading...' : 'Send Link'}
        </Button>
      </Form>
      <Link to='/'>Have an account?Login</Link>
    </Card>
  );
};

export default PasswordChangePage;