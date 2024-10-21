import React from "react";
import { Button } from "reactstrap";

interface ButtonGroupProps {
  button1Label: string;
  button2Label: string;
  button3Label?: string;
  btnId: any;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  button1Label,
  button2Label,
  button3Label,
  btnId,
}) => {
  return (
    <div className="d-flex justify-content-center gap-1 mt-1">
      <Button color="secondary" className="custom-btn">
        {button1Label}
      </Button>
      <Button color="secondary" className="custom-btn">
        {button2Label}
      </Button>
      {btnId === 2 && <Button className="custom-btn">{button3Label}</Button>}
    </div>
  );
};

export default ButtonGroup;
