import { Button } from 'reactstrap';
const selectedStyle = {
    backgroundColor: "#464b51", height: "23px", borderRadius: "4px", fontSize: "10px", padding: "3px", fontFamily: "Public Sans"
};
const nonSelectedStyle = {
    height: "23px", borderRadius: "4px", fontSize: "10px", padding: "3px", fontFamily: "Public Sans"
};
const AccountButton = ({ label, isSelected, onClick }: any) => {
    return (
        <Button
            style={isSelected ? selectedStyle : nonSelectedStyle}
            className="btn-sm"
            onClick={onClick}    >
            {label}
        </Button>
    );
};

export default AccountButton;