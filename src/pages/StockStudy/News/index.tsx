import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";

const News = ({ activeMenu, selectedIsin }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [newsList, setNewsList] = useState<any[]>([]);

  console.log("propss-->", activeMenu, selectedIsin);

  useEffect(() => {
    if (selectedIsin) {
      const getFundamentalNewsfeed = async () => {
        dispatch(showLoader("Please wait, we are processing your request"));

        try {
          const response = await apiServices.getFundamentalNewsfeed(
            selectedIsin
          );
          dispatch(hideLoader());
          const data = response?.data?.body?.newsList ?? [];
          setNewsList(data);
          console.log("getFundamentalNewsFeed", data);
        } catch (error) {
          console.error("Error fetching news:", error);
        } finally {
          dispatch(hideLoader());
        }
      };

      getFundamentalNewsfeed();
    } else {
      setNewsList([]);
    }
  }, [selectedIsin, activeMenu, dispatch]);

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={2}>
      {newsList.length > 0 ? (
        newsList.map((item, index) => (
          <Card
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
            }}
          >
            <CardMedia
              component="img"
              alt={item.stockName}
              image={
                item.imageUrl ||
                "https://www.bseindia.com/include/images/bselogo.png"
              }
              sx={{
                width: 100,
                height: "100%",
                borderRadius: 1,
                objectFit: "cover",
              }}
            />
            <Box sx={{ ml: 2, flex: 1 }}>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 1 }}
                >
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 0 }}>
                <Button
                  size="small"
                  style={{ color: "#11395C" }}
                  href={item.url || item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More
                </Button>
              </CardActions>
            </Box>
          </Card>
        ))
      ) : (
        <Typography>No news available.</Typography>
      )}
    </Box>
  );
};

export default News;
