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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchFundamentalNewsfeed } from "../../../redux/thunk/fundamental/news";

const News = ({ selectedIsin }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [newsList, setNewsList] = useState<any[]>([]);

  const currentIsin = useSelector(
    (state: RootState) => state.fundamentalNews.currentIsin
  );

  const newsData: any = useSelector((state: RootState) => {
    const data = state.fundamentalNews.currentNews?.data;
    console.log("NewsDataFetch", data, data.length);
    return data;
  });

  useEffect(() => {
    if (selectedIsin && selectedIsin !== currentIsin) {
      console.log("Dispatching API call for new ISIN", selectedIsin);
      dispatch(fetchFundamentalNewsfeed(selectedIsin));
    } else if (selectedIsin === currentIsin) {
      console.log("ISIN already loaded, skipping API call", selectedIsin);
    }
  }, [selectedIsin, currentIsin, dispatch]);

  useEffect(() => {
    console.log("currentISIN", currentIsin, "selecteISIN", selectedIsin);
    if (selectedIsin === currentIsin) {
      if (newsData && newsData.length > 0) {
        setNewsList(newsData);
      } else {
        // API returned empty → clear UI also
        setNewsList([]);
      }
    } else {
      // ISIN changed → clear
      setNewsList([]);
    }
  }, [newsData, selectedIsin, currentIsin]);

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
              <CardActions
                sx={{
                  p: 0,
                  // display: "flex",
                  // justifyContent: "space-between",
                  // alignItems: "center",
                  // width: "100%",
                }}
              >
                <Button
                  size="small"
                  style={{ color: "#11395C" }}
                  href={item.url || item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More
                </Button>

                <span style={{ fontSize: "14px" }}>
                  {new Date(item.pubDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
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
