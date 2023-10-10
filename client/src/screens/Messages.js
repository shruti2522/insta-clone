import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'; 

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',  // Stack children vertically
    alignItems: 'center',     // Center content horizontally
    paddingTop: theme.spacing(4), // Add space at the top
  },
  chatContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  listItem: {
    borderBottom: '1px solid #ccc',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2), // Add space below the heading
  }
}));

const ChatList = () => {
  const classes = useStyles();

  // Sample data for chat list
  const chatListData = [
    {
      username: 'user1',
      avatarUrl: 'https://placekitten.com/64/64', // Replace with actual avatar URL
      lastMessage: 'Hello there!',
    },
    {
      username: 'user2',
      avatarUrl: 'https://placekitten.com/64/67', // Replace with actual avatar URL
      lastMessage: 'How are you doing?',
    },
    {
      username: 'user3',
      avatarUrl: 'https://placekitten.com/64/66', // Replace with actual avatar URL
      lastMessage: 'Hii!',
    },
    {
      username: 'user4',
      avatarUrl: 'https://placekitten.com/64/65', // Replace with actual avatar URL
      lastMessage: 'Where are you?',
    },
    {
      username: 'user5',
      avatarUrl: 'https://placekitten.com/64/68', // Replace with actual avatar URL
      lastMessage: 'How you doing?',
    },
    // Add more chat items here
  ];

  return (
    <div className={classes.root}>
      <Typography className={classes.heading} variant="h1">
        Messages
      </Typography>
      <List className={classes.chatContainer}>
        {chatListData.map((chat, index) => (
          <Link to={`/chat/${chat.username}`} key={index}  style={{ textDecoration: 'none' }}>
            {/* Use Link to wrap each chat item */}
            <ListItem className={classes.listItem} button>
              <ListItemAvatar>
                <Avatar alt={chat.username} src={chat.avatarUrl} />
              </ListItemAvatar>
              <ListItemText
                primary={chat.username} 
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {chat.lastMessage}
                  </Typography>
                }
              />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );
};

export default ChatList;
