'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CardContainer from './../CardContainer';
import MessageSvg from './../MessageSvg';
import ActionButton from './../ActionButton';
import { log } from './../../utils';
import { connect } from 'react-redux';
import zChat from './../../../vendor/web-sdk';

class PrechatForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sent: false
    };
    this.send = this.send.bind(this);
    this.renderChild = this.renderChild.bind(this);
  }

  send(event) {
    event.preventDefault();
    const msg = this.refs.message.value;

    // Don't send empty messages
    if (!msg) return;

    zChat.setVisitorInfo(
      {
        display_name: this.refs.name.value,
        email: this.refs.email.value
      },
      err => {
        if (err) return;

        zChat.sendChatMsg(msg, err => {
          if (err) log('Error sending message');
        });
      }
    );

    this.props.dispatch({
      type: 'synthetic',
      detail: {
        type: 'visitor_send_msg',
        msg: msg
      }
    });
  }

  renderChild() {
    return (
      <form key="not-sent" className="offline-form">
        <div className="content">
          <div className="section">
            <label className="label">Name</label>
            <input ref="name" />
          </div>
          <div className="section">
            <label className="label">Email</label>
            <input ref="email" />
          </div>
          <div className="section">
            <label className="label">Message</label>
            <textarea ref="message" />
          </div>
        </div>
        <div className="button-container">
          <ActionButton
            addClass="button-send"
            label="Send"
            onClick={this.send}
          />
        </div>
      </form>
    );
  }

  render() {
    return (
      <CardContainer
        title="Introduce yourself!"
        addClass="offline-card"
        contentAddClass={this.state.sent ? 'sent' : ''}
        icon={<MessageSvg />}
      >
        {this.renderChild()}
      </CardContainer>
    );
  }
}

PrechatForm.displayName = 'PrechatForm';
PrechatForm.propTypes = {
  onClick: PropTypes.func,
  addClass: PropTypes.string
};

export default connect()(PrechatForm);
