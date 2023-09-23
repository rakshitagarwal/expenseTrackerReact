import { Form } from "react-bootstrap";

import { useRef } from "react";

import { premiumActions } from "../../store/premium-slice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
const ThemeChange = () => {
    const themeSwitch=useRef();

    const theme=useSelector(state=>state.premium.theme)
    const dispatch=useDispatch()

    const themeToggleHandler=()=>{
      dispatch(premiumActions.setTheme(themeSwitch.current.value))
    }
  return (
    <Form>
      <Form.Check
        type="switch"
        label={
          theme === "light" ? "Change Theme To Dark" : "Change theme To Light"
        }
        ref={themeSwitch}
        value={theme === "light" ? "dark" : "light"}
        onChange={themeToggleHandler}
      />
    </Form>
  );
};

export default ThemeChange;