import React from 'react';
// import { gravity } from '../../config/gravity';

export default class ApplicationLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_exists: this.props.data.user != null || false,
      user: this.props.data.user,
    };
  }

  render() {
//     const linksList = (
//       <div>
//         <li className="nav-item"><a className="nav-link" href="/channels"><i className="fas fa-fw fa-file" />{' '}<span>Chats</span></a></li>
//         <li className="nav-item"><a className="nav-link" href="/invites"><i className="fas fa-fw fa-file" />{' '}<span>Invites</span></a></li>
// {false && 'Generated plop links go here'}
//       </div>
//     );

    const loggedHeader = (
      <nav className="navbar navbar-expand navbar-custom static-top">
        <a className="navbar-brand" href="/">
        <img src="/img/metis-logo-small.png" height="32px" alt="logo" />
          <span className="ml-2">Metis</span>
        </a>

        {/* Mobile */}
        <ul className="navbar-nav ml-auto mobile-nav-button">
          {/* <li className="nav-item">
            <a
              className="nav-link"
              href="https://sigwo.tech/feedback"
              target="_blank"
            >
              Feedback
            </a>
          </li> */}
          <li className="nav-item">
            <a
              className="nav-link mt-1"
              href="/#"
              data-toggle="collapse"
              data-target="#mobile-menu"
            >
              <i className="fas fa-fw fa-bars" />
            </a>
          </li>
        </ul>

        <ul className="navbar-nav ml-auto desktop-nav">
        <li className="nav-item">
            <a className="nav-link" href="/channels" data-toggle="tooltip" title="Chats">
              <span>Chats</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/invites" data-toggle="tooltip" title="Invites">
              <span>Invites</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/account" data-toggle="tooltip"
              title={this.state.user_exists ? this.state.user.record.alias : ''}>
              <span>Profile</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/security" data-toggle="tooltip" title="Security">
              <span>Security</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" data-toggle="modal" data-target="#logoutModal">
              <span>Log Out</span>
            </a>
          </li>
          {/* TODO: Put this in the footer */}
          {/* <li className="nav-item">
            <a className="nav-link" href="https://sigwo.tech/feedback" target="_blank" data-toggle="tooltip" title="Feedback">
              <i className="fas fa-fw fa-lightbulb" />
            </a>
          </li> */}
        </ul>
      </nav>
    );

    const unloggedHeader = (
      <nav className="navbar navbar-expand navbar-custom static-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="/home">
            <img src="/img/metis-logo-small.png" height="32px" alt="logo" />
            <span className="ml-2">Metis</span>
          </a>

          <div className="ml-auto">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-button secondary" href="/signup">
                  Sign Up
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-button" href="/login">
                  Log In
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );

    const loggedWrapper = (
      <div id="wrapper">
        <div id="content-wrapper">
          <div className="collapse navbar-collapse mobile-nav" id="mobile-menu">
            <ul className="navbar-nav text-left">
              {/* <div className="card card-account bg-secondary">
                <div className="card-body">
                  <span className="h5">
                  {this.state.user_exists
                    ? `Hello, ${this.state.user.record.alias}`
                    : 'your name'}</span>
                </div>
              </div> */}
              <ul className="nav flex-column">
              <li className="nav-item">
                  <a className="nav-link" href="/channels">
                    <span>Chats</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/invites">
                    <span>Invites</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/account">
                    <span>Profile</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/security">
                    <span>Security</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/#"
                    data-toggle="modal"
                    data-target="#logoutModal"
                  >
                    <span>Log Out</span>
                  </a>
                </li>
              </ul>
            </ul>
          </div>
          {this.props.children}
        </div>
      </div>
    );

    const unloggedWrapper = (
      <div id="wrapper">
        <div id="content-wrapper">
          {this.props.children}
        </div>
      </div>
    );

    return (
      <html>
        <head>
          <meta httpEquiv="Content-Type" content="text/html;charset=utf-8" />
          <title>{this.props.data.name}</title>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="description" content="Metis Messenger - Metis is a fully encrypted chatting application built on Jupiter’s blockchain. We use account features and JSON formatting to bundle and military-grade encryption to secure every single message sent using Metis. Metis uniquely uses accounts for channels and builds each user their channel list that is stored in their account." />

          <link rel="dns-prefetch" href="//fonts.googleapis.com" />

          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css"
            rel="stylesheet"
          />
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js" />
          <link
            href="/vendor/fontawesome-free/css/all.min.css"
            rel="stylesheet"
          />
          <link
            href="/vendor/fontawesome-free/css/all.min.css"
            rel="stylesheet"
          />
          <link
            href="/vendor/bootstrap/css/bootstrap.min.css"
            rel="stylesheet"
          />

          <link
            href="https://fonts.googleapis.com/css?family=Lato: 300,300i,400,400i"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Poppins:100,100italic,200,200italic,300,300italic,regular,italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic&amp;subset=latin,latin-ext&amp;display=swap"
            rel="stylesheet"
            type="text/css"
            media="all"
          />

          <link href="/css/sb-admin.css" rel="stylesheet" />
        </head>
        <body className="p-0">
          <span id="toastrMessages" />
          <div
            id={this.props.data.dashboard === true ? 'logged-in' : 'logged-out'}
            className="application-wrapper"
          >
            {this.props.data.dashboard === true ? loggedHeader : unloggedHeader}

            {this.props.data.dashboard === true
              ? loggedWrapper
              : unloggedWrapper}

            {/* {this.props.includeFooter &&
              <footer className="footer">
                <div className="container-fluid my-auto">
                  <div className="copyright text-center my-auto">
                    {process.env.APPNAME ? (
                      <div>
                        <div>Copyright © 2018 YourBrand</div>
                        <div className="mt-2 small">powered by Gravity</div>
                      </div>
                    ) : (
                      <div>
                        <div>Copyright © 2018 Sigwo Technologies</div>
                        <div className="mt-2 small">powered by Gravity</div>
                      </div>
                    )}
                  </div>
                </div>
              </footer>
            } */}
          </div>

          <div
            className="modal fade"
            id="logoutModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby=" "
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id=" ">
                    Ready to Leave?
                  </h5>
                  <button
                    className="close"
                    type="button"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  Click on 'Log Out' if you are ready to end your current session.
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <a className="btn btn-custom button-link" href="/logout">
                    Log Out
                  </a>
                </div>
              </div>
            </div>
          </div>

          <script src="/vendor/bootstrap/js/bootstrap.bundle.min.js" />

          <script
            src="/bundle.js"
            data-props={JSON.stringify(this.props.data)}
            id="props"
          />
        </body>
      </html>
    );
  }
}
