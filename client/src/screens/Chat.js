import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
 chat: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: 0,
  },
 heading: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2), 
    backgroundColor: theme.palette.background.paper,
    borderBottom: '1px solid #ddd', 
  },
  avatar: {
    marginRight: theme.spacing(1), 
  },
  messageList: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(2),
    display: 'flex',
  },
  message: {
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0),
    borderRadius: '10px',
    wordWrap: 'break-word',
    maxWidth: '100%',
    display: 'inline-block',
    clear: 'both',
  },
  userMessage: {
    backgroundColor: '#007bff',
    color: 'white',
    alignSelf: 'flex-end',
    width: 'fit-content',
    float: 'left',
  },
  otherMessage: {
    backgroundColor: '#e0e0e0',
    color: '#333',
    alignSelf: 'flex-start',
    width: 'fit-content',
    float: 'left',
  },
  messageInput: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderTop: '1px solid #ddd',
  },
  input: {
    flex: 1,
    marginRight: theme.spacing(2),
  },
 sendButton: {
    backgroundColor: '#007bff',
    color: 'white',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
    padding: theme.spacing(1, 3), 
    borderRadius: '20px', 
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', 
    transition: 'background-color 0.3s ease-in-out', 
  },
}));

function Chat() {
  const { username } = useParams();
  const classes = useStyles();
  const messageListRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const contactAvatarUrl = 'https://placekitten.com/64/65'; 
    const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
        setMessages([
        ...messages,
        { text: newMessage, sender: username, id: Date.now() }, 
        ]);
        setNewMessage('');
    }
    };
 
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = 0; 
    }
  }, [messages]);

 return (
    <Container className={classes.chat}>
      <div className={classes.heading}>
        <Avatar src={contactAvatarUrl} alt={username} className={classes.avatar} /> 
        <Typography variant="h6">
          {username}
        </Typography>
      </div>
      <div className={classes.messageList} ref={messageListRef}>
        <List>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              className={`${classes.message} ${
                message.sender === username
                  ? classes.userMessage
                  : classes.otherMessage
              }`}
            >
              {message.text}
            </ListItem>
          ))}
        </List>
      </div>
      <div className={classes.messageInput}>
        <TextField
          className={classes.input}
          label="Type your message..."
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
            handleSendMessage();
            }
        }}
        />
        <Button
          className={classes.sendButton}
          variant="contained"
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </div>
    </Container>
  );
}

export default Chat;