import React, { Component } from "react";
import axios from "axios";
import Chat from "./Chat";
import "./style.css";
import "./style/Messages.css"

class Messages extends Component {
  state = {
    chatList: [],
  };

  componentDidMount() {
    const user = this.props.match.params.id;
    return axios
      .get(`/api/chat/${user}`)
      .then((response) => {
        this.setState({ chatList: response.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setChat = (data) => {
    const user = this.props.match.params.id;
    return axios
      .get(`/api/chat/${user}`)
      .then((response) => {
        this.setState({ chatList: response.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const userId = this.props.user._id;
    const incomingFilter = this.state.chatList.filter((msg) => {
      return msg.userReceive._id === userId && msg.item !== null;
    });

    const incomingMsg = incomingFilter.map((msg) => {
      return (
        <div className="main">
          <Chat
            setUser={this.props.setUser}
            setChat={this.setChat}
            chat={msg}
            user={this.props.user}
          />
        </div>
      );
    });

    const outgoingFilter = this.state.chatList.filter((msg) => {
      return msg.userSend._id === userId && msg.item !== null;
    });

    const outgoingMsg = outgoingFilter.map((msg) => {
      return (
        <div className="main">
          <Chat
            setUser={this.props.setUser}
            chat={msg}
            setChat={this.setChat}
            user={this.props.user}
          />
        </div>
      );
    });

    return (
      <div className="main">
        <h2>Incoming Offers</h2>
        <hr />
        {incomingMsg.length < 1 && <p>No Incoming Offers</p>}
        {incomingMsg}
        <hr />
        <hr />
        <h2>Sent Offers</h2>
        <hr />
        {outgoingMsg.length < 1 && <p>No Outgoing Offers</p>}
        {outgoingMsg}
      </div>
    );
  }
}

export default Messages;
