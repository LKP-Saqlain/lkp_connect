import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Logo from "../../../assets/logo.png";

function Header() {
  return (
    <Container maxWidth="xl">
      <Toolbar disableGutters>
        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}></Box>
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>
        <Box sx={{ flexGrow: 0 }}>
          <Box
            component="img"
            alt="Logo"
            src={Logo}
            width={"auto"}
            height="50px"
          />
        </Box>
      </Toolbar>
    </Container>
  );
}
export default Header;
