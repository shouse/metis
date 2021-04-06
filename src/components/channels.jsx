import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import toastr from 'toastr';
import MenuContainer from './CustomComponents/MenuContainer.jsx';
import MobileMenuContainer from './CustomComponents/MobileMenuContainer.jsx';

class ChannelsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passphrase: '',
      name: '',
      password: '',
      channels: [],
      submitted: false,
      update_submitted: false,
			loading: true,
			checking: false,
      inviteUser: false,
      invitationAccount: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.createChat = this.createChat.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  resetRecords(newData) {
    this.setState({
      channels: newData,
    });
  }

  loadData() {
    const page = this;
    const config = {
      headers: {
        user_api_key: this.props.user.record.api_key,
        user_public_key: this.props.public_key,
        accessData: this.props.accessData,
      },
    };

    axios.get(`/api/users/${this.props.user.id}/channels`, config)
      .then((response) => {
        if (response.data.success) {
          // console.log('Response channel');
          // console.log(response.data);
          page.setState({
            channels: response.data.channels,
            channelTableExist: true,
            loading: false,
          });
          page.monitorData();
        } else {
          toastr.info('No channels found.');
        }
      })
      .catch((error) => {
        console.log(error);
        toastr.error('Error occurred while loading your channels. Please try again later.');
      });
  }

  checkUpdates() {
		if (this.state.checking) {
			console.log('Already checking for updates.');
			return;
		}
		this.setState({ checking: true });
		const self = this;
    const currentData = JSON.stringify(this.state.channels);
    const config = {
      headers: {
        user_api_key: this.props.user.record.api_key,
        user_public_key: this.props.public_key,
        accessData: this.props.accessData,
      },
		};

    axios.get(`/api/users/${this.props.user.id}/channels`, config)
      .then((response) => {
        if (response.data.success) {
          // console.log(response.data);
          const responseData = response.data.channels;

          if (currentData !== JSON.stringify(responseData)) {
            self.resetRecords(responseData);
          }
				}
				this.setState({ checking: false });
      })
      .catch((error) => {
        console.log(error);
				toastr.info('Error occurred while verifying channel updates. Please try again later.');
				this.setState({ checking: false });
      });
  }

  monitorData() {
    const self = this;

    setInterval(() => {
      if (!(self.state.submitted || self.state.update_submitted || self.state.checking)) {
        self.checkUpdates();
      }
    }, 10 * 1000); // 10 secs
  }


  handleChange(aField, event) {
    if (aField === 'passphrase') {
      this.setState({ passphrase: event.target.value });
    } else if (aField === 'name') {
      this.setState({ name: event.target.value });
    } else if (aField === 'password') {
      this.setState({ password: event.target.value });
    } else if (aField === 'invitationAccount') {
      this.setState({ invitationAccount: event.target.value});
    }
  }

  createChat(event) {
		event.preventDefault();
		if (!this.state.name) {
			toastr.info('You must provide a valid name for the chat');
			return;
		}
    this.setState({
      submitted: true,
    });

    const page = this;

    const record = {
      passphrase: this.state.passphrase,
      name: this.state.name,
      password: this.state.password,
      address: this.props.user.record.account,
      date_confirmed: Date.now(),
      user_id: this.props.user.id,
      user_api_key: this.props.user.record.api_key,
      public_key: this.props.public_key,
      user_address: this.props.user.record.account,
    };

    axios.post('/api/channels', { data: record, user: this.props.accessData })
      .then((response) => {
        if (response.data.success) {
          page.setState({
            passphrase: '',
            name: '',
            password: '',
            submitted: false,
					});
					toastr.success('Chat created');
					this.checkUpdates();
        } else {
          // console.log(response.data);
          // toastr.error(response.data.message);
					response.data.validations.messages
						.forEach((message) => {
							toastr.error(message);
						});
        }
      })
      .catch((error) => {
        console.log(error);
        toastr.error('There was an error creating your chat. Please try again later.');
      });
  }

  inviteUser(event, channel) {
    event.preventDefault();
    const { state } = this;
    const page = this;
    const invite = {
      recipient: state.invitationAccount,
      channel: channel,
    };

    axios.post('/channels/invite', { data: invite })
      .then((response) => {
        // console.log(response);
        if (response.data.success) {
          page.setState({
            update_submitted: false,
          });

          toastr.success('Invite sent!');
        } else {
          toastr.error('There was an error sending your invite. Please try again later.');
        }
      })
      .catch((error) => {
        console.log(error);
        toastr.error('There was an error sending your invite. Please try again later.');
      });
  }

  inviteButton = (channel) => {
    const channelData = channel;
    this.setState({ channelData });

    (
      <a className="text-light mr-1">
        Invite {channel.id}
      </a>
    )
  }

  handleInvite = () => {
    this.setState({inviteUser: true});
  }

  handleInviteClose = () => {
    this.setState({inviteUser: false});
  }

  handleInviteSave = () => {
    console.log('invite saved');
    // channelData should grab the current channel selected.
    // const channelData = this.state.channels[channel]
    // this.setState({ channelData });
    // console.log(channelData);
  }

  render() {
    const { state } = this;

    // const recordList = (
    //   state.channels.map((channel, index) => <li className="channels-list-item text-light nav-item" key={index}><a className="nav-link" href={`/channels/${channel.id}`}><span className="d-inline-block text-truncate" style={{ maxWidth: '180px' }}>{channel.channel_record.name}</span></a></li>)
    // );

    const newChannelForm = (
      <div className="card card-register mx-auto mt-5">
        <div className="card-header bg-custom text-light h5">
          Add New Chat
        </div>
        <div className="card-body">
          <div className="form-group my-4">
            <input placeholder="Enter new chat name here..." value={state.name } className="form-control" onChange={this.handleChange.bind(this, 'name')} />
          </div>
          <div className="text-center mt-3">
            <button className="btn btn-custom" disabled={state.submitted} onClick={this.createChat.bind(this)}>{state.submitted ? 'Adding Chat...' : 'Add Chat'}</button>
          </div>
        </div>
      </div>);

    const loading = <div style={{
      textAlign: 'center',
      paddingTop: '25vh',
      fontSize: '55px',
      overflow: 'hidden',
    }}><i className="fa fa-spinner fa-pulse"></i></div>;

    const content = <div style={{overflow: 'auto'}}>
			{ state.channels.length > 0 || this.state.channelTableExist
				? newChannelForm
				: <div className="card card-register mx-auto my-5">
					<div className="card-body">
						<div className="text-center alert alert-warning m-0">Unable to create chats yet, confirming account details in the blockchain.</div>
					</div>
				</div>
			}
    </div>;

    return (
      <div>
        <MenuContainer channels={state.channels} />
        {state.loading ? loading : content}
        <MobileMenuContainer channels={state.channels} />
      </div>
    );
  }
}

const ChannelsExport = () => {
  if (document.getElementById('ChannelsComponent') != null) {
    const element = document.getElementById('props');
    const props = JSON.parse(element.getAttribute('data-props'));

    render(
      <ChannelsComponent
      user={props.user}
      validation={props.validation}
      public_key={props.public_key}
      accessData = {props.accessData}
      />,
      document.getElementById('ChannelsComponent'),
    );
  }
};

module.exports = ChannelsExport();
