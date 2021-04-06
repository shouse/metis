import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import toastr from 'toastr';
import MenuContainer from './CustomComponents/MenuContainer.jsx';
import MobileMenuContainer from './CustomComponents/MobileMenuContainer.jsx';
import { messagesConfig } from '../../config/constants';
import { urlencoded } from 'body-parser';


const { maxMessageLength } = messagesConfig;

class DataRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // smessage: {},
    };
  }

  render() {
    const { props } = this;
    const record = props.parent.state.messages[props.message];
    const { data } = record;
    const rand = require("crypto").createHash('md5').update(props.user.record.alias).digest("hex");
    const oRand = require("crypto").createHash('md5').update(data.name).digest("hex");
    const identicon = "https://www.gravatar.com/avatar/"+rand+"?s=64&d=identicon";
    const oIdenticon = "https://www.gravatar.com/avatar/"+oRand+"?s=64&d=identicon";

    const name = data.name === `${props.user.record.alias}`
      || data.name === `${props.user.record.firstname} ${props.user.record.lastname}`
      ? 'You' : data.name;

    const date = (new Date(record.date)).toLocaleString();

    const readOnlyLeft = (
      <div className="message-row">
        <div className="card-plain card-message-incoming message-card text-left message d-inline-block float-left my-2 pr-4">
          <div className="card-body p-2">
            <div className="bg-dark rounded-circle o-hidden float-left mr-2">
              <img src={oIdenticon} height="40px" alt="logo" />
            </div>
            <div id="incoming_message" className="ml-5 rounded">
              <div style={{ fontWeight: '600', color: 'darkgrey' }}>{name}</div>
              <div className="my-2" style={{ width: '60%' }}>{data.message}</div>
              <div className="small mt-1" style={{ color: 'darkgrey' }}>{date}</div>
            </div>
          </div>
        </div>
      </div>
    );

    const readOnlyRight = (
      <div className="message-row">
        <div className="card-plain card-message-outgoing message-card text-right message d-inline-block float-right my-2 pl-4">
          <div className="card-body p-2">
            <div className="bg-dark rounded-circle o-hidden float-right ml-2">
              <img src={identicon} height="40px" alt="logo" />
            </div>
            <div id="incoming_message" className="mr-5 p-2 rounded">
              <div style={{ fontWeight: '600', color: 'lightgrey' }}><strong>You</strong></div>
              <div className="my-2" style={{ width: '-60%' }}>{data.message}</div>
              <div className="small mt-1" style={{ color: 'lightgrey' }}>{date}</div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      name === 'You' ? readOnlyRight : readOnlyLeft
    );
  }
}

class ConvosComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aliases: [],
      members: [],
      // passphrase: '',
      // sname: '',
      // password: '',
      messages: [],
      message: '',
      submitted: false,
      // update_submitted: false,
      tableData: {},
      // querying: false,
      waitingForData: false,
      // monitoring: false,
      queryScope: 'all',
      transactionIds: [],
      firstIndex: 0,
			loadingChannels: true,
			loadingMessages: true,
      sideMenuOpen: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.createMessage = this.createMessage.bind(this);
  }

  componentDidMount() {
    this.loadTableData();
  }

  componentDidUpdate() {
    // const objDiv = document.getElementById('messageList');
    // objDiv.scrollTop = objDiv.scrollHeight;
    // this.scrollToBottom();
  }

  setTransactionsIds(messages) {
    const transactionIds = [];
    for (let x = 0; x < messages.length; x += 1) {
      const thisMessage = messages[x];
      if (thisMessage && thisMessage.fullRecord) {
        transactionIds.push(thisMessage.fullRecord.transaction);
      }
    }

    this.setState({
      transactionIds,
    });
  }

  getOlderMessages() {
    const page = this;
    const { state } = this;
    const currentIndex = parseInt(state.firstIndex, 10);
    const currentMessages = parseInt(state.messages.length, 10);
    const newIndex = currentIndex + currentMessages;

    this.setState({
      waitingForOldData: true,
    });

    this.setState({
      firstIndex: newIndex,
    }, async () => {
      const response = await page.getData('all');

      if (response.success && response.messages) {
        const currentData = state.messages;
        const newData = response.messages;

        const mergedData = newData.concat(currentData);
        this.setState({
          messages: mergedData,
          waitingForOldData: false,
        }, () => {
          page.setTransactionsIds(response.messages);
        });
      } else {
        toastr.error('Error loading older messages');
      }
    });
  }

  async getData(queryScope) {
    const { props } = this;
    const { state } = this;
    const config = {
      headers: {
        user_api_key: props.user.record.api_key,
        user_public_key: props.public_key,
        accessdata: props.accessData,
        channelaccess: state.tableData.passphrase,
        channeladdress: state.tableData.account,
        channelkey: state.tableData.password,
        channelpublic: state.tableData.publicKey,
      },
    };
    let indexNumber;
    if (queryScope === 'unconfirmed') {
      indexNumber = 0;
    } else {
      indexNumber = state.firstIndex;
    }
    const response = await axios.get(`/data/messages/${queryScope}/${indexNumber}`, config);

    return response.data;
  }

  scrollToBottom = () => {
    this.messageEnd.scrollIntoView({ behavior: 'smooth' });
  }

  toggleSideMenu = () => {
    const self = this;
    this.setState({
      sideMenuOpen: !self.state.sideMenuOpen,
    });
  }

  checkUpdates() {
    const { state } = this;
    if (!state.waitingForData) {
      this.loadData();
    }
  }

  loadData() {
    const page = this;
    const { props } = this;
    const { state } = this;
    this.setState({
      waitingForData: true,
    });

    const currentData = JSON.stringify(state.messages);

    const config = {
      headers: {
        user_api_key: props.user.record.api_key,
        user_public_key: props.public_key,
        accessdata: props.accessData,
        channelaccess: state.tableData.passphrase,
        channeladdress: state.tableData.account,
        channelkey: state.tableData.password,
        channelpublic: state.tableData.publicKey,
      },
    };
    const index = state.queryScope === 'unconfirmed' ? 0 : state.firstIndex;

    axios.get(`/data/messages/${state.queryScope}/${index}`, config)
      .then((response) => {
        // console.log(response.data);
        if (response.data.success) {
          if (page.state.queryScope === 'all') {
            const responseData = JSON.stringify(response.data.messages);

            if (currentData !== responseData
              && response.data.messages) {
              page.setTransactionsIds(response.data.messages);
              page.setState({
                messages: response.data.messages,
                queryScope: 'unconfirmed',
                loadingMessages: false,
              });
              page.scrollToBottom();
            }
          } else if (page.state.queryScope === 'unconfirmed') {
            const newMessages = response.data.messages;
            if (newMessages.length > 0) {
              page.handleNewData(response.data.messages);
            }
          }
          page.setState({
						waitingForData: false,
						loadingMessages: false,
          }, () => {
            if (!page.state.monitoring) {
              page.setState({
                monitoring: true,
              }, () => {
                page.monitorData();
              });
            }
          });
        } else {
          page.setState({
						waitingForData: false,
						loadingMessages: false,
          });
          // toastr.error('No record history');
        }
      })
      .catch((error) => {
        console.log(error);
        toastr.error('There was an error loading your messages.');
      });
  }

  loadTableData() {
    const page = this;
    const { props } = this;
    const config = {
      headers: {
        user_api_key: props.user.record.api_key,
        user_public_key: props.public_key,
        accessData: props.accessData,
      },
    };

    axios.get(`/api/users/${props.user.id}/channels`, config)
      .then((response) => {
        if (response.data.success) {
          page.setState({
            channels: response.data.channels,
            loadingChannels: false,
          });
          // page.monitorData();
          for (let x = 0; x < response.data.channels.length; x += 1) {
            const thisChannel = response.data.channels[x];

            if (thisChannel.id === props.channelId) {
              this.setState({
                tableData: thisChannel.channel_record,
              }, () => {
                page.loadData('all');
                page.loadMembersList();
              });
            }
          }
        } else {
          toastr.info('No record history');
        }
      })
      .catch((error) => {
        console.log(error);
        toastr.error('There was an error loading your messages.');
      });
  }

  updateMessage() {
    const self = this;
    this.setState({
      message: self.state.message,
    });
  }

  resetRecords(newData) {
    this.setState({
      messages: newData,
      waitingForData: false,
    });
  }

  handleNewData(messages) {
    const { state } = this;
    const ids = state.transactionIds;
    const currentMessages = state.messages;
    for (let x = 0; x < messages.length; x += 1) {
      const thisMessage = messages[x];

      if (!ids.includes(thisMessage.fullRecord.transaction)) {
        currentMessages.push(thisMessage);
        ids.push(thisMessage.fullRecord.transaction);
      }
    }

    this.setState({
      transactionIds: ids,
      messages: currentMessages,
    });

    this.scrollToBottom();
  }

  monitorData() {
    const self = this;

    setInterval(() => {
      if (!(self.state.submitted || self.state.update_submitted)) {
        self.checkUpdates();
      }
    }, 1500);
  }

  handleChange(aField, event) {
    if (aField === 'message') {
      this.setState({ message: event.target.value });
    }
  }

  createMessage(event) {
    event.preventDefault();
    const { props } = this;
    const { state } = this;
    this.setState({
      submitted: true,
    });

    const page = this;

    const record = {
      name: `${props.user.record.alias}` || `${props.user.record.firstname} ${props.user.record.lastname}`,
      message: state.message,
      sender: props.user.record.account,
    };

    if (record.message
      && record.message.length > 0
      && record.message.length <= maxMessageLength
    ) {
      axios.post('/data/messages', {
        data: record,
        user: props.accessData,
        tableData: state.tableData,
      })
        .then((response) => {
          if (response.data.success) {
            page.setState({
              passphrase: '',
              name: '',
              password: '',
              submitted: false,
              message: '',
            });
            toastr.success('Message sent');
          } else if (response.data.validations) {
            response.data.validations.messages
              .forEach((message) => {
                toastr.error(message);
              });
          } else {
            response.data.messages
              .forEach((message) => {
                toastr.error(message);
              });
          }
        })
        .catch((error) => {
          console.log(error);
          toastr.error('There was an error sending your message.');
        });
    } else if (record.message && record.message.length > maxMessageLength) {
      toastr.error(`Message exceeds limit (${maxMessageLength} characters)`);
    } else {
      toastr.error('Invalid message');
    }
  }


  async loadMembersList() {
    const { state } = this;
    const { props } = this;
    const self = this;
    const config = {
      headers: {
        channeladdress: state.tableData.account,
        channelkey: state.tableData.password,
        channelpublic: state.tableData.publicKey,
      },
    };

    let response;

    try {
      response = await axios.get('/data/members', config);
    } catch (e) {
      response = e;
    }

    if (!response.data.error) {
      const { members } = response.data;
      const { aliases } = response.data;
      this.setState({
        members,
        aliases,
      }, async () => {
        // TODO: The user's aliases who created the chat should be added when the
        // document was created. This should not be done once we load the members list for the first time
        console.log(`Your aliases are ${state.aliases}`);
        const { alias } = props.user.record;
        if (!self.state.members.includes(alias) && !self.state.aliases.includes(alias)) {
          const res = await self.addMember();
          if (res.success) {
            toastr.success("Your alias has been added to this channel's member list");
          } else {
            console.log(res);
          }
        }
      });
    }
    return response.data;
  }

  async addMember() {
    const { state } = this;

    const params = {
      channeladdress: state.tableData.account,
      channelkey: state.tableData.password,
      channelpublic: state.tableData.publicKey,
    };

    let response;

    try {
      response = await axios.post('/data/members', params);
    } catch (e) {
      response = e;
      return e;
    }

    return response.data;
  }

  render() {
    const self = this;
    const { state } = this;
    const Channel = state.tableData || {};

    const recordList = (
      state.messages.map((channel, index) => (
        <DataRow
          parent={self}
          message={index}
          user={self.props.user}
          public_key={self.props.public_key}
          key={`row${(channel.signature)}`}
        />))
		);

		const noRecordList = (
			<div className="container mx-auto text-center mt-4">
				<p className="primary-reg-16">There are no messages yet in this channel.</p>
				<p className="primary-reg-14">Get started by sending your first message below.</p>
			</div>
		);

    const loading = (
      <div style={{
				textAlign: 'center', marginTop: '25vh',
				fontSize: '55px', overflow: 'hidden', color: 'black'
      }}
      >
        <i className="fa fa-spinner fa-pulse" />
      </div>
    );

    const memberList = state.members.map(m => (
      <div>
        <p>{m}</p>
      </div>
    ));
    const memberModal = (
      <div className="modal fade" id="memberListModal" tabIndex="-1" role="dialog" aria-labelledby="memberListModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="memberListModalLabel">
                {`${Channel.name} Members`}
              </h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {state.members.length > 0 ? memberList : null}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );

    const content = (
      <div>
        {state.sideMenuOpen ? <MenuContainer channels={state.channels} /> : null}
        <div className="convo-wrapper">
          <div className="convo-header">
            <div className="convo-header-title pl-3">
              <span>{Channel.name}</span>
            </div>

            {/* Action Items */}
            <div className="d-flex align-items-center justify-content-between pl-3 pr-2">
              <div className="d-flex align-items-center">
                <div className="convo-mobile-modal-button mr-2">
                  <a
                    href="#"
                    data-toggle="modal"
                    data-target="#channelsModal"
                  >
                    All Chats
                  </a>
                </div>
                <div className="" data-toggle="tooltip" title="Members">
                  <a href="#" data-toggle="modal" data-target="#memberListModal">
                    Members
                  </a>
                  {memberModal}
                </div>
              </div>
              <div className="convo-load-button text-right">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={state.waitingForOldData}
                  onClick={this.getOlderMessages.bind(this)}>
                  {state.waitingForOldData ? 'Loading messages...' : 'Load older messages'}
                </button>
              </div>
            </div>
          </div>
          <div className="convo-messages-outer container-fluid">
						{/* style={{ color: "#f0f0f0"}} */}
            <div className="convo-messages-inner" id="messageList">
              <div className="convo-messages-content">
                {state.loadingMessages ? loading : recordList}
								{!state.loadingMessages && state.messages.length === 0 ? noRecordList : null}
              </div>
              <div
                style={{ float: 'left', clear: 'both', color: '#f0f0f0' }}
                ref={(el) => { this.messageEnd = el; }}
              />
            </div>
          </div>
          <div className="convo-input-outer">

            <div className="convo-input-inner" style={{ marginBottom: '0px' }}>
              <form className="convo-input-form" style={{ marginBottom: '5px' }} onSubmit={this.updateMessage}>
                <input
                  type="text"
                  maxLength={maxMessageLength}
                  className="convo-input-text"
                  placeholder="Enter your message here..."
                  value={state.message}
                  onChange={this.handleChange.bind(this, 'message')}
                  required="required"
                />
                <button
                  type="submit" style={{ width: "80px"}}
                  className="btn btn-custom"
                  disabled={state.submitted}
                  onClick={this.createMessage.bind(this)}
                >
                  <i className="fa fa-paper-plane" style={{'line-height': '36px'}}></i>
                  <p className="" style={{color: 'grey'}}>{`${state.message.length}/${maxMessageLength}`}</p>
                </button>
              </form>
            </div>
          </div>
        </div>
        <MobileMenuContainer channels={state.channels} />
      </div>
    );

    return (
      state.loadingChannels ? loading : content
    );
  }
}

const ConvosExport = () => {
  if (document.getElementById('convosComponent') != null) {
    const element = document.getElementById('props');
    const props = JSON.parse(element.getAttribute('data-props'));

    render(
      <ConvosComponent
        user={props.user}
        validation={props.validation}
        public_key={props.public_key}
        accessData={props.accessData}
        channelId={props.channelId}
      />,
      document.getElementById('convosComponent'),
    );
  }
};

module.exports = ConvosExport();
