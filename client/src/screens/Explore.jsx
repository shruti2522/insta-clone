import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import { formatDistanceToNow } from "date-fns";
import data from "./posts";
const Explore = () => {
  const [isLoading, setIsLoading] = useState(false);



  return (
    <div>
      {isLoading ? (
        <CircularProgress />
      ) : (
        data.data.map((item, index) => (
          <Card key={index} style={{ margin: "20px" }}>
            <CardHeader
              avatar={
                <Avatar>
                  <img src={item.image} alt={item.userName} />
                </Avatar>
              }
              title={item.userName}
              subheader={item.posted}
            />
            <CardMedia
              style={{ height: "400px" }}
              image={item.image}
              title={item.title}
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                {item.title}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton aria-label="Like">
              {item.likes}
                <FavoriteBorderIcon />
              </IconButton>
              <IconButton aria-label="Comments">
              {item.comments}
                <ChatBubbleOutlineIcon />
              </IconButton>
              <IconButton aria-label="Bookmark">
                <BookmarkBorderIcon />
              </IconButton>
            </CardActions>
            <Divider />
          </Card>
        ))
      )}
    </div>
  );
};

export default Explore;